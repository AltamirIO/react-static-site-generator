# Altamir React Static Site Generator

## Static Site Generator

The React Static Site Generator is designed to help create impressive websites impressively fast.

Right now, RSSG depends on `bulma-styled-components`, a package created by Altamir's own mpaupulaire4. In the future, RSSG should be plug-and-play, allowing to pass in custom UI libraries and create amazing sites.

## Use

Usage right now is very simplistic. Basically, RSSG is just accepting a JSON markup of a website, and then traversing that and spitting out a React SPA.

Here is an example of a site object that RSSG can take in:
```
{
  pages: {
    about: {
      components: [{
        content: "hello",
        type: "span"
      }, {
        components: [{
          props: {
            style: {
              backgroundColor: "red",
              height: "150px",
              width: "150px"
            }
          },
          type: "div"
        }],
        props: {
          style: {
            backgroundColor: "blue",
            height: "200px",
            width: "300px"
          }
        },
        type: "div"
      }],
      title: "About Me"
    },
    main: {
      components: [{
        content: "this is a test",
        type: "Notification"
      }],
      title: "Home Page"
    }
  }
}
```

## Contributing

Please Contribute! You can start by making this readme not terrible :)