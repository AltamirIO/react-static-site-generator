# Altamir React Static Site Generator

## Static Site Generator

The React Static Site Generator is designed to help create impressive websites impressively fast.

Right now, RSSG depends on `bulma-styled-components`, a package created by Altamir's own mpaupulaire4. In the future, RSSG should be plug-and-play, allowing to pass in custom UI libraries and create amazing sites.

## Use

### Installation

1. Navigate into any React.js project and run `npm install @altamir/react-static-site-generator` or `yarn add @altamir/react-static-site-generator`.

2. Import the module where it will be used.
```jsx
import React from 'react'
import siteGenerator from '@altamir/react-static-site-generator'
```

3. Generate static components
```jsx
import ReactDOM from 'react-dom';
import siteGenerator from '@altamir/react-static-site-generator'
import * as Bulma from 'bulma-styled-components'

ReactDOM.render(siteGenerator({
  pages: {
    main: {
      title: 'Home Page',
      components: [{
        type: Bulma.Notification,
        content: 'hello'
      }]
    },
    about: {
      title: 'About Me',
      content: ''
    }
  }
}, {
  componentLibraries: [Bulma],
  themeProvider: Bulma.BulmaStyledTheme
}), document.getElementById('root'));
```

### Configuration

Usage right now is very simplistic. Basically, RSSG is just accepting a JSON markup of a website, and then traversing that and spitting out a React SPA.

Here is an example of a site object that RSSG can take in:

```javascript
siteGenerator({
  pages: {
    main: {
      title: 'Home Page',
      components: [{
        type: Bulma.Notification,
        content: 'hello'
      }]
    },
    about: {
      title: 'About Me',
      content: ''
    }
  }
}, {
  componentLibraries: [Bulma],
  themeProvider: Bulma.BulmaStyledTheme
})
```


## Contributing

Please Contribute! Please remember to comment your code. This project deals largely in generics, so comments are enormously helpful in understanding what is going on.