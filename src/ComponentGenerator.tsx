import * as React from 'react'
import { SiteComponent, IOptions } from './SiteGenerator'

/**
 * generateComponent generates static components from a simple JSON schema.
 * @param component A component or collection of components to be generated
 * @param options configuration options, including custom UI libraries
 * @param index an index for unique keys
 */
export function generateComponent(component: SiteComponent | SiteComponent[], options: IOptions, index = 0): any {
  if (!component) {
    return <div />
  }
  if (Array.isArray(component)) {
    return component.map((c, i) => generateComponent(c, options, i))
  }
  let Tag = component.type
  let isReactElement = false
  /**
   * This tests if component.type can already be rendered as a component. If so, we don't need to worry
   * about finding the named component in a provided UI library.
   */
  if ((typeof Tag === 'string' && Tag.toLowerCase() === Tag) || React.isValidElement(<Tag />)) {
    isReactElement = true
  }
  const key = `${component.type}${index}`
  /**
   * If we can't render the component, we search in a provided UI library for the component.
   */
  if (!isReactElement) {
    try {
      // Cast component.type as a string
      const customComponent = component.type as string
      if (options.componentLibraries) {
        // Search in the collection of component libraries for the named component
        const firstCompatibleLibrary = options.componentLibraries.find((library) => {
          if (customComponent in library) {
            return true
          }
          return false
        })
        // if we can't find the component in the provided libraries, we cannot render
        if (!firstCompatibleLibrary) {
          throw TypeError(`${component.type} could not be found in any of the provided style libraries`)
        }
        // Otherwise, we have a renderable component
        Tag = firstCompatibleLibrary[customComponent]
        if (!Tag) {
          throw TypeError(`${Tag} does not exist in bulma styled components`)
        }
      }
      // if we can't render the component appropriately, throw an error
      const element = <Tag />
      if (!element || !React.isValidElement(element)) {
        throw TypeError(`${component.type} is not a valid react component`)
      }
    } catch (e) {
      // for a component that can't render, throw up
      throw(e)
    }
  }

  // if all tests pass, we should have a valid component on our hands. Render it.
  const el = React.createElement(Tag, { ...(component.props || {}), ...{ key } }, component.content || (component.components ? generateComponent(component.components, options, index + 1) : null))
  if (React.isValidElement(el)) {
    return el
  }
  return <div />
}