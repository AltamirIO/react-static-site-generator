declare module "*.json" {
  const value: SiteConfigJSON;
  export default value;
}

type SiteComponent = {
  type: string,
  content?: string,
  props?: object,
  components?: SiteComponent[]
}

type SitePage = {
  title: string,
  components?: SiteComponent[]
}

export type SiteConfigJSON = {
  pages: {
    main: SitePage,
    [key: string]: SitePage
  }
}