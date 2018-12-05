import * as React from 'react'
import * as config from './site.json'
import { Route } from 'react-router-dom'
// import ComponentChecker from './ComponentChecker.js';
export function generateSite() {
  console.log(config)
  return (
    <React.Fragment>
      {Object.keys(config.pages).map((page) => {
        const component = () => generateComponent(config.pages[page].components)
        return <Route key={page} path={`/${page}`} component={component} />
      })}
    </React.Fragment>
  )
}

function generateComponent(component: any, index = 0, arr: any[] = []): any {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i, a) => generateComponent(c, i, a))
  }
  const Tag = component.type
  const key = `${component.type}${index}`
  // if (!ComponentChecker.isElement(Tag)) {
  //   try {
  //     // Tag = require('bulma-styled-components')
  //     if (!Tag || !ComponentChecker.isReactComponent(Tag)) {
  //       throw TypeError(`${component.type} is not a valid react component`)
  //     }
  //   } catch (e) {
  //     return <div key={key} />
  //   }
  // }
  return (<Tag key={key} {...(component.props || {})}>{component.content || generateComponent(component.components)}</Tag>)
}

