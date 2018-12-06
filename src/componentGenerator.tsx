import * as React from 'react'
import { SiteComponent, IOptions } from './siteGenerator'

export function generateComponent(component: SiteComponent | SiteComponent[], options: IOptions, index = 0): any {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i) => generateComponent(c, options, i))
  }
  let Tag = component.type
  let isReactElement = false
  if ((typeof Tag === 'string' && Tag.toLowerCase() === Tag) || React.isValidElement(<Tag />)) {
    isReactElement = true
  }
  const key = `${component.type}${index}`
  if (!isReactElement) {
    try {
      const Styled = component.type as string
      if (options.componentLibraries) {
        const firstCompatibleLibrary = options.componentLibraries.find((library) => {
          if (Styled in library) {
            return true
          }
          return false
        })
        if (!firstCompatibleLibrary) {
          throw TypeError(`${component.type} could not be found in any of the provided style libraries`)
        }
        console.log('This is a styled component')
        Tag = firstCompatibleLibrary[Styled]
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
  const el = React.createElement(Tag, { ...(component.props || {}), ...{ key } }, component.content || (component.components ? generateComponent(component.components, options, index + 1) : null))
  if (React.isValidElement(el)) {
    return el
  }
  return <div />
}