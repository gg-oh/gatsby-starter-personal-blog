// const JssProvider = require("react-jss/src/JssProvider");
import { JssProvider } from "react-jss";
import { Provider } from "react-redux";
// const Provider = require("react-redux/es/components/Provider");
// const ReactDOMServer = require("react-dom/server");
import { renderToString } from "react-dom/server";
// const React = requore("react");
import React from "react";
import "dotenv/config";
// require("dotenv").config();

// const getPageContext = require("./src/getPageContext");
// const createStore = require("./src/state/store");
// const theme = require("./src/styles/theme");

import getPageContext from "./src/getPageContext";
import createStore from "./src/state/store";
import theme from "./src/styles/theme";

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
  const pageContext = getPageContext();
  const store = createStore();

  replaceBodyHTMLString(
    renderToString(
      <Provider store={store}>
        <JssProvider
          registry={pageContext.sheetsRegistry}
          generateClassName={pageContext.generateClassName}
        >
          {React.cloneElement(bodyComponent, {
            pageContext
          })}
        </JssProvider>
      </Provider>
    )
  );

  setHeadComponents([
    <style
      type="text/css"
      id="server-side-jss"
      key="server-side-jss"
      dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
    />
  ]);
};

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  console.log(theme);
  setHeadComponents([]);
  setPostBodyComponents([
    <script
      key={`webfontsloader-setup`}
      dangerouslySetInnerHTML={{
        __html: `
        WebFontConfig = {
          google: {
            families: ["${theme.base.fonts.styledFamily}:${theme.base.fonts.styledFonts}"]
          }
        };

        (function(d) {
            var wf = d.createElement('script'), s = d.scripts[0];
            wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
            wf.async = true;
            s.parentNode.insertBefore(wf, s);
        })(document);`
      }}
    />
  ]);
};

// exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
//   const pageContext = getPageContext();
//   const store = createStore();

//   replaceBodyHTMLString(
//     renderToString(
//       <Provider store={store}>
//         <JssProvider
//           registry={pageContext.sheetsRegistry}
//           generateClassName={pageContext.generateClassName}
//         >
//           {React.cloneElement(bodyComponent, {
//             pageContext
//           })}
//         </JssProvider>
//       </Provider>
//     )
//   );

//   setHeadComponents([
//     <style
//       type="text/css"
//       id="server-side-jss"
//       key="server-side-jss"
//       dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
//     />
//   ]);
// };

// exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
//   setHeadComponents([]);
//   setPostBodyComponents([
//     <script
//       key={`webfontsloader-setup`}
//       dangerouslySetInnerHTML={{
//         __html: `
//         WebFontConfig = {
//           google: {
//             families: ["${theme.base.fonts.styledFamily}:${theme.base.fonts.styledFonts}"]
//           }
//         };

//         (function(d) {
//             var wf = d.createElement('script'), s = d.scripts[0];
//             wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
//             wf.async = true;
//             s.parentNode.insertBefore(wf, s);
//         })(document);`
//       }}
//     />
//   ]);
// };