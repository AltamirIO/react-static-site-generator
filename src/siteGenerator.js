import React from 'react'
import config from './site.json'
import { Route } from 'react-router-dom'
import ComponentChecker from './validComponentChecker.js';
export function generateSite() {
  return (
  <React.Fragment>
    {Object.keys(config.pages).map((page) => {
      return <Route key={page} path={`/${page}`} component={() => generateComponent(config.pages[page].components)} />
    })}
  </React.Fragment>
  )
}

function generateComponent(component, index = 0, arr = []) {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i, a) => generateComponent(c, i, a))
  }
  let Tag = component.type
  if (!ComponentChecker.isElement(Tag)) {
    try {
      Tag = require(`bulma-styled-components`)[Tag]
      if (!Tag || !ComponentChecker.isReactComponent(Tag)) {
        throw TypeError(`${component.type} is not a valid react component`)
      }
    } catch (e) {
      return <div />
    }
  }
  return (<Tag key={`${component.type}${index}`} {...(component.props || {})}>{component.content || generateComponent(component.components)}</Tag>)
}

