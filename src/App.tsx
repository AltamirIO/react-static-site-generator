import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { generateSite } from './siteGenerator'
import { BulmaStyledTheme } from 'bulma-styled-components'

class App extends React.Component {
  public render() {
    return (
      <BulmaStyledTheme>
        <Router>
          {generateSite()}
        </Router>
      </BulmaStyledTheme>
    )
  }
}

export default App;
