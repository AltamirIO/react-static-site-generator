import React from 'react'

export default class ComponentChecker {
  static isClassComponent(component) {
    return (
      typeof component === 'function' &&
      !! component.prototype.isReactComponent
    )
  }
  
  static isFunctionComponent(component) {
    return (
      typeof component === 'function' &&
      String(component).includes('return React.createElement')
    )
  }
    
  static isReactComponent(component) {
    return (
      ComponentChecker.isClassComponent(component) ||
      ComponentChecker.isFunctionComponent(component)
    )
  }

  static isElement(element) {
    return React.isValidElement(element)
  }
  
  static isDOMTypeElement(element) {
    return ComponentChecker.isElement(element) && typeof element.type === 'string'
  }
  
  static isCompositeTypeElement(element) {
    return ComponentChecker.isElement(element) && typeof element.type === 'function'
  }
}