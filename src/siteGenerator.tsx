import * as React from 'react'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import HeadWrapper from './HeadWrapper';

interface IOptions {
  componentLibrary?: object
  themeProvider?: {
    package: string
    module: string
    themePropName?: string
    theme?: any
  }
}

export default function generateSite(config: any, options: IOptions = {}) {
  if (!config.pages) {
    throw TypeError('A RSSG object must have a "page" key')
  }
  if (!options.componentLibrary) {
    options.componentLibrary = require('bulma-styled-components')
  }
  const defaultOptions: IOptions = {
    componentLibrary: require('bulma-styled-components'),
    themeProvider: {
      package: 'bulma-styled-components',
      module: 'BulmaStyledTheme',
    },
    ...options
  }

  const RouterWrapper = (
    <Router>
      <Switch>
        {Object.keys(config.pages).map((page) => {
          return <Route key={page} path={`/${page}`} component={() => <HeadWrapper pageTitle={config.pages[page].title}>{generateComponent(config.pages[page].components, defaultOptions)}</HeadWrapper>} />
        })}
        <Route path="/" exact={true} component={() => <HeadWrapper pageTitle={config.pages.main.title}>{generateComponent(config.pages.main.components, defaultOptions)}</HeadWrapper>} />
        <Redirect to="/" />
      </Switch>
    </Router>
  )
  if (options.themeProvider) {
    let theme = {}
    if (options.themeProvider.themePropName && options.themeProvider.theme) {
      theme = {
        [options.themeProvider.themePropName]: options.themeProvider.theme
      }
    }
    const Provider = require(options.themeProvider.package)[options.themeProvider.module]
    return (
      <Provider {...theme}>
        {RouterWrapper}
      </Provider>
    )
  }
  return RouterWrapper
}

function generateComponent(component: any, options: IOptions, index = 0): any {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i) => generateComponent(c, options, i))
  }
  let Tag = component.type
  let isDOMElement = false
  if (Tag.toLowerCase() === Tag) {
    isDOMElement = true
  }
  const key = `${component.type}${index}`
  if (!isDOMElement) {
    try {
      const Styled = component.type
      if (options.componentLibrary && Styled in options.componentLibrary) {
        console.log('This is a styled component')
        Tag = options.componentLibrary[Styled]
        if (!Tag) {
          throw TypeError(`${Tag} does not exist in bulma styled components`)
        }
      }
      const element = <Tag />
      if (!element || !React.isValidElement(element)) {
        throw TypeError(`${component.type} is not a valid react component`)
      }
    } catch (e) {
      console.log('err', e)
      return <div key={key} />
    }
  }
  const el = React.createElement(Tag, { ...(component.props || {}), ...{ key } }, component.content || generateComponent(component.components, options, index + 1))
  if (React.isValidElement(el)) {
    return el
  }
  return <div />
}

