'use strict';

var reactRouterDom = require('react-router-dom');
var tslib_1 = require('tslib');
var React = require('react');

var HeadWrapper = /** @class */ (function (_super) {
    tslib_1.__extends(HeadWrapper, _super);
    function HeadWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeadWrapper.prototype.componentDidMount = function () {
        document.title = this.props.pageTitle;
    };
    HeadWrapper.prototype.render = function () {
        return this.props.children;
    };
    return HeadWrapper;
}(React.Component));

/**
 * generateComponent generates static components from a simple JSON schema.
 * @param component A component or collection of components to be generated
 * @param options configuration options, including custom UI libraries
 * @param index an index for unique keys
 */
function generateComponent(component, options, index) {
    if (index === void 0) { index = 0; }
    if (!component) {
        return React.createElement("div", null);
    }
    if (Array.isArray(component)) {
        return component.map(function (c, i) { return generateComponent(c, options, i); });
    }
    var Tag = component.type;
    var isReactElement = false;
    /**
     * This tests if component.type can already be rendered as a component. If so, we don't need to worry
     * about finding the named component in a provided UI library.
     */
    if ((typeof Tag === 'string' && Tag.toLowerCase() === Tag) || React.isValidElement(React.createElement(Tag, null))) {
        isReactElement = true;
    }
    var key = "" + component.type + index;
    /**
     * If we can't render the component, we search in a provided UI library for the component.
     */
    if (!isReactElement) {
        try {
            // Cast component.type as a string
            var customComponent_1 = component.type;
            if (options.componentLibraries) {
                // Search in the collection of component libraries for the named component
                var firstCompatibleLibrary = options.componentLibraries.find(function (library) {
                    if (customComponent_1 in library) {
                        return true;
                    }
                    return false;
                });
                // if we can't find the component in the provided libraries, we cannot render
                if (!firstCompatibleLibrary) {
                    throw TypeError(component.type + " could not be found in any of the provided style libraries");
                }
                // Otherwise, we have a renderable component
                Tag = firstCompatibleLibrary[customComponent_1];
                if (!Tag) {
                    throw TypeError(Tag + " does not exist in bulma styled components");
                }
            }
            // if we can't render the component appropriately, throw an error
            var element = React.createElement(Tag, null);
            if (!element || !React.isValidElement(element)) {
                throw TypeError(component.type + " is not a valid react component");
            }
        }
        catch (e) {
            // for a component that can't render, throw up
            throw (e);
        }
    }
    // if all tests pass, we should have a valid component on our hands. Render it.
    var el = React.createElement(Tag, tslib_1.__assign({}, (component.props || {}), { key: key }), component.content || (component.components ? generateComponent(component.components, options, index + 1) : null));
    if (React.isValidElement(el)) {
        return el;
    }
    return React.createElement("div", null);
}

/**
 * If the Site Config has a pages key, we create and render routes
 */
var RouteGenerator = /** @class */ (function (_super) {
    tslib_1.__extends(RouteGenerator, _super);
    function RouteGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteGenerator.prototype.render = function () {
        var _a = this.props, config = _a.config, options = _a.options;
        if (!config || !config.pages || Object.keys(config.pages).length < 1) {
            return React.createElement("div", null);
        }
        var main = config.pages.main;
        if (!main) {
            main = config.pages[Object.keys(config.pages)[0]];
        }
        return (React.createElement(reactRouterDom.BrowserRouter, null,
            React.createElement(reactRouterDom.Switch, null,
                Object.keys(config.pages || {}).map(function (page) {
                    return React.createElement(reactRouterDom.Route, { key: page, path: "/" + page, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages[page].title }, generateComponent(config.pages[page].components, options)); } });
                }),
                React.createElement(reactRouterDom.Route, { path: "/", exact: true, component: function () { return React.createElement(HeadWrapper, { pageTitle: main.title }, generateComponent(main.components, options)); } }),
                React.createElement(reactRouterDom.Redirect, { to: "/" }))));
    };
    return RouteGenerator;
}(React.PureComponent));

/**
 * Generates static components based on a Javascript Object configuration module
 * @param {ISiteConfigJSON} config Configuration for static components
 * @param {IOptions} options Customizations for the site generation. This can include Custom UI libraries, and theming modules
 */
function SiteGenerator(config, options) {
    if (options === void 0) { options = {}; }
    var _a;
    /**
     * The configuration file can have either a pages key or a components key. It MUST have one or the other.
     */
    if (!config.pages && !config.components) {
        throw TypeError('A RSSG object must have a "pages" OR "components" key');
    }
    var children = null;
    /**
     * If the config has pages, we assume we are building an entire static site, complete with routing options
     * Otherwise, we assume we are simply generating a collection of components with no routing.
     */
    if (config.pages) {
        children = React.createElement(RouteGenerator, { config: config, options: options });
    }
    else if (config.components) {
        children = React.createElement(React.Fragment, null, generateComponent(config.components, options));
    }
    /**
     * RSSG allows for custom theme providers and themes to be passed in
     */
    var theme = {};
    if (options.theme && options.themeProvider) {
        if (options.theme.themePropName && options.theme.theme) {
            theme = (_a = {},
                _a[options.theme.themePropName] = options.theme.theme,
                _a);
        }
        var Provider = options.themeProvider.module;
        return (React.createElement(Provider, tslib_1.__assign({}, theme), children));
    }
    /**
     * If there is no theming provider, simply return the collection of components
     */
    return children;
}

module.exports = SiteGenerator;
