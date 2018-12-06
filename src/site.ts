import { SiteConfigJSON } from "index.d";

const JSONConfig: SiteConfigJSON = {
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

export default JSONConfig