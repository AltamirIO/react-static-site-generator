import * as React from 'react'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import HeadWrapper from './HeadWrapper';
import { IOptions, ISiteConfigJSON } from './SiteGenerator';
import { generateComponent } from './ComponentGenerator'

interface IProps {
  config: ISiteConfigJSON
  options: IOptions
}

/**
 * If the Site Config has a pages key, we create and render routes
 */
export default class RouteGenerator extends React.PureComponent<IProps> {
  public render() {
    const { config, options } = this.props
    if (!config || !config.pages || Object.keys(config.pages).length < 1) {
      return <div />
    }
    let main = config.pages.main
    if (!main) {
      main = config.pages[Object.keys(config.pages)[0]]
    }
    return (
      <Router>
        <Switch>
          {Object.keys(config.pages || {}).map((page) => {
            return <Route key={page} path={`/${page}`} component={() => <HeadWrapper pageTitle={config.pages[page].title}>{generateComponent(config.pages[page].components, options)}</HeadWrapper>} />
          })}
          <Route path="/" exact={true} component={() => <HeadWrapper pageTitle={main.title}>{generateComponent(main.components, options)}</HeadWrapper>} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}