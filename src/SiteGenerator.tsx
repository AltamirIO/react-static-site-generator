import * as React from 'react'
import RouteGenerator from './RouteGenerator';
import { generateComponent } from './ComponentGenerator';

export interface IOptions {
  componentLibraries?: object[]
  themeProvider?: any
  theme?: {
    themePropName: string
    theme: any
  }
}
export interface ISiteComponent {
  type: string | React.FunctionComponent<any> | React.ComponentClass<any, any>,
  content?: string,
  props?: object,
  components?: ISiteComponent[]
}

interface ISitePage {
  title: string,
  components?: ISiteComponent[]
}

export interface ISiteConfigJSON {
  components?: ISiteComponent[]
  pages?: {
    main: ISitePage,
    [key: string]: ISitePage
  }
}

/**
 * Generates static components based on a Javascript Object configuration module
 * @param {ISiteConfigJSON} config Configuration for static components 
 * @param {IOptions} options Customizations for the site generation. This can include Custom UI libraries, and theming modules
 */
export default function SiteGenerator(config: ISiteConfigJSON, options: IOptions = {}) {
  /**
   * The configuration file can have either a pages key or a components key. It MUST have one or the other.
   */
  if (!config.pages && !config.components) {
    throw TypeError('A RSSG object must have a "pages" OR "components" key')
  }


  let children = null
  /**
   * If the config has pages, we assume we are building an entire static site, complete with routing options
   * Otherwise, we assume we are simply generating a collection of components with no routing.
   */
  if (config.pages) {
    children = <RouteGenerator config={config} options={options} />
  } else if (config.components) {
    children = <React.Fragment>{generateComponent(config.components, options)}</React.Fragment>
  }

  /**
   * RSSG allows for custom theme providers and themes to be passed in
   */
  let theme = {}
  if (options.theme && options.themeProvider) {
    if (options.theme.themePropName && options.theme.theme) {
      theme = {
        [options.theme.themePropName]: options.theme.theme
      }
    }
    const Provider = options.themeProvider.module
    console.log('provider', Provider)
    return (
      <Provider {...theme}>
        {children}
      </Provider>
    )
  }
  
  /**
   * If there is no theming provider, simply return the collection of components
   */
  return children
}



