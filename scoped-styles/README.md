https://web-components.now.sh/scoped-styles/

- solution is using pure HTML and CSS
- scope doesn't inherit properties from global stylesheet by default
- scope could have own .css file
- scope could inherit some of the global styles with native CSS @import
- if server using HTTP2 you already have module separated styles
- if scope/element is used multiple times, it doesn't duplicated style code (like with inline styles,..)