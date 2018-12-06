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

function generateSite(config, options) {
    if (options === void 0) { options = {}; }
    var _a;
    if (!config.pages || !Array.isArray(config.pages)) {
        throw TypeError('A RSSG object must have a "page" key');
    }
    if (!options.componentLibrary) {
        options.componentLibrary = require('bulma-styled-components');
    }
    var defaultOptions = tslib_1.__assign({ componentLibrary: require('bulma-styled-components'), themeProvider: {
            package: 'bulma-styled-components',
            module: 'BulmaStyledTheme',
        } }, options);
    var RouterWrapper = (React.createElement(reactRouterDom.BrowserRouter, null,
        React.createElement(reactRouterDom.Switch, null,
            Object.keys(config.pages).map(function (page) {
                return React.createElement(reactRouterDom.Route, { key: page, path: "/" + page, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages[page].title }, generateComponent(config.pages[page].components, defaultOptions)); } });
            }),
            React.createElement(reactRouterDom.Route, { path: "/", exact: true, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages.main.title }, generateComponent(config.pages.main.components, defaultOptions)); } }),
            React.createElement(reactRouterDom.Redirect, { to: "/" }))));
    if (options.themeProvider) {
        var theme = {};
        if (options.themeProvider.themePropName && options.themeProvider.theme) {
            theme = (_a = {},
                _a[options.themeProvider.themePropName] = options.themeProvider.theme,
                _a);
        }
        var Provider = require(options.themeProvider.package)[options.themeProvider.module];
        return (React.createElement(Provider, tslib_1.__assign({}, theme), RouterWrapper));
    }
    return RouterWrapper;
}
function generateComponent(component, options, index) {
    if (index === void 0) { index = 0; }
    if (!component) {
        return React.createElement("div", null);
    }
    if (Array.isArray(component)) {
        return component.map(function (c, i) { return generateComponent(c, options, i); });
    }
    var Tag = component.type;
    var isDOMElement = false;
    if (Tag.toLowerCase() === Tag) {
        isDOMElement = true;
    }
    var key = "" + component.type + index;
    if (!isDOMElement) {
        try {
            var Styled = component.type;
            if (options.componentLibrary && Styled in options.componentLibrary) {
                console.log('This is a styled component');
                Tag = options.componentLibrary[Styled];
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
    var el = React.createElement(Tag, tslib_1.__assign({}, (component.props || {}), { key: key }), component.content || generateComponent(component.components, options, index + 1));
    if (React.isValidElement(el)) {
        return el;
    }
    return React.createElement("div", null);
}

module.exports = generateSite;
