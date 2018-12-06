'use strict';

var reactRouterDom = require('react-router-dom');
var bulmaStyledComponents = require('bulma-styled-components');
var changeCase = require('change-case');
var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var JSONConfig = {
    pages: {
        about: {
            components: [{
                    content: "hello",
                    type: "span"
                }, {
                    components: [{
                            props: {
                                style: {
                                    backgroundColor: "red",
                                    height: "150px",
                                    width: "150px"
                                }
                            },
                            type: "div"
                        }],
                    props: {
                        style: {
                            backgroundColor: "blue",
                            height: "200px",
                            width: "300px"
                        }
                    },
                    type: "div"
                }],
            title: "About Me"
        },
        main: {
            components: [{
                    content: "this is a test",
                    type: "Notification"
                }],
            title: "Home Page"
        }
    }
};

var HeadWrapper = /** @class */ (function (_super) {
    __extends(HeadWrapper, _super);
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

var siteConfig = JSONConfig;
function generateSite(config) {
    if (config === void 0) { config = siteConfig; }
    return (React.createElement(bulmaStyledComponents.BulmaStyledTheme, null,
        React.createElement(reactRouterDom.BrowserRouter, null,
            React.createElement(reactRouterDom.Switch, null,
                Object.keys(config.pages).map(function (page) {
                    return React.createElement(reactRouterDom.Route, { key: page, path: "/" + page, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages[page].title }, generateComponent(config.pages[page].components)); } });
                }),
                React.createElement(reactRouterDom.Route, { path: "/", exact: true, component: function () { return React.createElement(HeadWrapper, { pageTitle: config.pages.main.title }, generateComponent(config.pages.main.components)); } }),
                React.createElement(reactRouterDom.Redirect, { to: "/" })))));
}
function generateComponent(component, index, arr) {
    if (index === void 0) { index = 0; }
    if (arr === void 0) { arr = []; }
    if (!component) {
        return React.createElement("div", null);
    }
    if (Array.isArray(component)) {
        return component.map(function (c, i, a) { return generateComponent(c, i, a); });
    }
    var Tag = component.type;
    var isDOMElement = false;
    if (Tag.toLowerCase() === Tag) {
        isDOMElement = true;
    }
    var key = "" + component.type + index;
    if (!isDOMElement) {
        try {
            var Styled = changeCase.pascalCase(component.type);
            if (Styled in require('bulma-styled-components')) {
                console.log('This is a styled component');
                Tag = require('bulma-styled-components')[Styled];
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
    var el = React.createElement(Tag, __assign({}, (component.props || {}), { key: key }), component.content || generateComponent(component.components));
    if (React.isValidElement(el)) {
        return el;
    }
    return React.createElement("div", null);
}

module.exports = generateSite;
