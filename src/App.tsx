import * as React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { generateSite } from './siteGenerator'
class App extends React.Component {
  public render() {
    return (
      <Router>
        <Switch>
          <div>
            {generateSite()}
          </div>
        </Switch>
      </Router>
    )
  }
}

export default App;
