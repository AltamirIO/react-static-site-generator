import React from 'react'
import { Switch, BrowserRouter as Router } from 'react-router-dom'
import {generateSite} from './siteGenerator'
class App extends React.Component {
  render() {
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
