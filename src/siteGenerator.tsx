import * as React from 'react'
import JSONConfig from './site'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import { BulmaStyledTheme } from 'bulma-styled-components'
import { SiteConfigJSON } from 'index.d.js';
import HeadWrapper from './HeadWrapper';

const siteConfig = JSONConfig as any as SiteConfigJSON
export default function generateSite(config = siteConfig) {
  return (
    <BulmaStyledTheme>
      <Router>
        <Switch>
          {Object.keys(config.pages).map((page) => {
            return <Route key={page} path={`/${page}`} component={() => <HeadWrapper pageTitle={config.pages[page].title}>{generateComponent(config.pages[page].components)}</HeadWrapper>} />
          })}
          <Route path="/" exact={true} component={() => <HeadWrapper pageTitle={config.pages.main.title}>{generateComponent(config.pages.main.components)}</HeadWrapper>} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </BulmaStyledTheme>
  )
}

function generateComponent(component: any, index = 0, arr: any[] = []): any {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i, a) => generateComponent(c, i, a))
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
      if (Styled in require('bulma-styled-components')) {
        console.log('This is a styled component')
        Tag = require('bulma-styled-components')[Styled]
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
  const el = React.createElement(Tag, { ...(component.props || {}), ...{ key } }, component.content || generateComponent(component.components))
  if (React.isValidElement(el)) {
    return el
  }
  return <div />
}

