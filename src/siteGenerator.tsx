import * as React from 'react'
import RouteGenerator from './RouteGenerator';
import { generateComponent } from './componentGenerator';

export interface IOptions {
  componentLibraries?: object[]
  themeProvider?: any
  theme?: {
    themePropName: string
    theme: any
  }
}
export type SiteComponent = {
  type: string | React.FunctionComponent<any> | React.ComponentClass<any, any>,
  content?: string,
  props?: object,
  components?: SiteComponent[]
}

type SitePage = {
  title: string,
  components?: SiteComponent[]
}

export type SiteConfigJSON = {
  components?: SiteComponent[]
  pages?: {
    main: SitePage,
    [key: string]: SitePage
  }
}

export default function generateSite(config: SiteConfigJSON, options: IOptions = {}) {
  if (!config.pages && !config.components) {
    throw TypeError('A RSSG object must have a "pages" OR "components" key')
  }

  const defaultOptions: IOptions = {
    componentLibraries: [],
    ...options
  }

  let children = null
  if (config.pages) {
    children = <RouteGenerator config={config} options={defaultOptions} />
  } else if (config.components) {
    children = <div>{generateComponent(config.components, options)}</div>
  }
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
  return children
}



