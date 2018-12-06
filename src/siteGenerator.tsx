import * as React from 'react'
import * as JSONConfig from './site.json'
import { Route, Switch, Redirect } from 'react-router-dom'
import { pascalCase } from 'change-case'
import { SiteConfigJSON } from 'types.js';
import ComponentChecker from './ComponentChecker.js';
const config = JSONConfig as any as SiteConfigJSON
export function generateSite() {
  const defaultComponent = () => generateComponent(config.pages.main.components)
  return (
    <Switch>
      {Object.keys(config.pages).map((page) => {
        const component = () => generateComponent(config.pages[page].components)
        return <Route key={page} path={`/${page}`} component={component} />
      })}
      <Route path="/" exact={true} component={defaultComponent} />
      <Redirect to="/" />
    </Switch>
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
  let isDOMElement: boolean = false
  if (Tag.toLowerCase() === Tag) {
    isDOMElement = true
  }
  const key = `${component.type}${index}`
  if (!isDOMElement) {
    try {
      const Styled = pascalCase(component.type)
      if (Styled in require('bulma-styled-components')) {
        console.log('This is a styled component')
        Tag = require('bulma-styled-components')[Styled]
        if (!Tag) {
          throw TypeError(`${Tag} does not exist in bulma styled components`)
        }
      }
      const element = <Tag />
      if (!element || (!ComponentChecker.isReactComponent(element) && !ComponentChecker.isElement(element))) {
        throw TypeError(`${component.type} is not a valid react component`)
      }
    } catch (e) {
      console.log('err', e)
      return <div key={key} />
    }
  }
  const el = React.createElement(Tag, {...(component.props || {}), ...{ key }}, [component.content] || generateComponent(component.components))
  if (React.isValidElement(el)) {
    return el
  }
  return <div />
}

