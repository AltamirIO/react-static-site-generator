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
    if ((typeof Tag === 'string' && Tag.toLowerCase() === Tag) || React.isValidElement(React.createElement(Tag, null))) {
        isReactElement = true;
    }
    var key = "" + component.type + index;
    if (!isReactElement) {
        try {
            var Styled_1 = component.type;
            if (options.componentLibraries) {
                var firstCompatibleLibrary = options.componentLibraries.find(function (library) {
                    if (Styled_1 in library) {
                        return true;
                    }
                    return false;
                });
                if (!firstCompatibleLibrary) {
                    throw TypeError(component.type + " could not be found in any of the provided style libraries");
                }
                console.log('This is a styled component');
                Tag = firstCompatibleLibrary[Styled_1];
                if (!Tag) {
                    throw TypeError(Tag + " does not exist in bulma styled components");
                }
            }
            var element = React.createElement(Tag, null);
            if (!element || !React.isValidElement(element)) {
                throw TypeError(component.type + " is not a valid react component");
            }
        }
        catch (e) {
            console.log('err', e);
            return React.createElement("div", { key: key });
        }
    }
    var el = React.createElement(Tag, tslib_1.__assign({}, (component.props || {}), { key: key }), component.content || (component.components ? generateComponent(component.components, options, index + 1) : null));
    if (React.isValidElement(el)) {
        return el;
    }
    return React.createElement("div", null);
}

var RouteGenerator = /** @class */ (function (_super) {
    tslib_1.__extends(RouteGenerator, _super);
    function RouteGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteGenerator.prototype.render = function () {
        var _a = this.props, config = _a.config, options = _a.options;
        if (!config || !config.pages) {
            return React.createElement("div", null);
        }
        return (React.createElement(reactRouterDom.BrowserRouter, null,
            React.createElement(reactRouterDom.Switch, null,
                Object.keys(config.pages || {}).map(function (page) {
                    return React.createElement(reactRouterDom.Route, { key: page, path: "/" + page, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages[page].title }, generateComponent(config.pages[page].components, options)); } });
                }),
                React.createElement(reactRouterDom.Route, { path: "/", exact: true, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages.main.title }, generateComponent(config.pages.main.components, options)); } }),
                React.createElement(reactRouterDom.Redirect, { to: "/" }))));
    };
    return RouteGenerator;
}(React.PureComponent));

function generateSite(config, options) {
    if (options === void 0) { options = {}; }
    var _a;
    if (!config.pages && !config.components) {
        throw TypeError('A RSSG object must have a "pages" OR "components" key');
    }
    var defaultOptions = tslib_1.__assign({ componentLibraries: [] }, options);
    var children = null;
    if (config.pages) {
        children = React.createElement(RouteGenerator, { config: config, options: defaultOptions });
    }
    else if (config.components) {
        children = React.createElement("div", null, generateComponent(config.components, options));
    }
    var theme = {};
    if (options.theme && options.themeProvider) {
        if (options.theme.themePropName && options.theme.theme) {
            theme = (_a = {},
                _a[options.theme.themePropName] = options.theme.theme,
                _a);
        }
        var Provider = options.themeProvider.module;
        console.log('provider', Provider);
        return (React.createElement(Provider, tslib_1.__assign({}, theme), children));
    }
    return children;
}

module.exports = generateSite;
