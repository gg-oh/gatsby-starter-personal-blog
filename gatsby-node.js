const webpack = require("webpack");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { store } = require(`./node_modules/gatsby/dist/redux`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;
    createNodeField({
      node,
      name: `slug`,
      value: `${separtorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
    });
    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : ""
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  console.log("I will create a page!");

  const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  const pageTemplate = path.resolve("./src/templates/PageTemplate.js");

  const result = await graphql(
    `
      {
        allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/posts|pages/" } }, limit: 1000) {
          edges {
            node {
              id
              fields {
                slug
                prefix
              }
            }
          }
        }
      }
    `
  );

  console.log(result.data);

  result.data.allMarkdownRemark.edges.forEach(edge => {
    const slug = edge.node.fields.slug;
    const isPost = /posts/.test(edge.node.id);

    createPage({
      path: slug,
      component: isPost ? postTemplate : pageTemplate,
      context: {
        slug: slug,
        title: edge.node.title
      }
    });

    // createPage({
    //   path: `${edge.node.slug}`,
    //   component: blogPostTemplate,
    //   context: {
    //     title: edge.node.title
    //   }
    // });
  });

  // return new Promise((resolve, reject) => {
  //   const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  //   const pageTemplate = path.resolve("./src/templates/PageTemplate.js");
  //   resolve(
  //     graphql(
  //       `
  //         {
  //           allMarkdownRemark(filter: { id: { regex: "//posts|pages//" } }, limit: 1000) {
  //             edges {
  //               node {
  //                 id
  //                 fields {
  //                   slug
  //                   prefix
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       `
  //     ).then(result => {
  //       if (result.errors) {
  //         console.log(result.errors);
  //         reject(result.errors);
  //       }

  //       // Create posts and pages.
  //       _.each(result.data.allMarkdownRemark.edges, edge => {
  //         const slug = edge.node.fields.slug;
  //         const isPost = /posts/.test(edge.node.id);

  //         createPage({
  //           path: slug,
  //           component: isPost ? postTemplate : pageTemplate,
  //           context: {
  //             slug: slug
  //           }
  //         });
  //       });
  //     })
  //   );
  // });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  switch (stage) {
    case "build-javascript":
      {
        // let components = store.getState().pages.map(page => page.componentChunkName);
        // components = _.uniq(components);
        actions.setWebpackConfig({
          optimization: {
            splitChunks: {
              name: `commons`,
              chunks: "all",
              // chunks: [`app`, ...components],
              minChunks: 1
            }
          }
        });
        // config.plugin("BundleAnalyzerPlugin", BundleAnalyzerPlugin, [
        //   {
        //     analyzerMode: "static",
        //     reportFilename: "./report/treemap.html",
        //     openAnalyzer: true,
        //     logLevel: "error",
        //     defaultSizes: "gzip"
        //   }
        // ]);
      }
      break;
  }
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: `@babel/preset-env`
  });
  actions.setBabelPreset({
    name: `@babel/preset-react`
  });
};
