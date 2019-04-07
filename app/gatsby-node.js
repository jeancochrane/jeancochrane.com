const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // Create slugs for Markdown posts.
  if (node.internal.type === "MarkdownRemark") {
    const slug =  createFilePath({ node, getNode, basePath: "posts"})
    createNodeField({
      node,
      name: "slug",
      value: slug
    })
  }
}

exports.createPages = ({ graphql, actions}) => {
  const { createPage } = actions
  return graphql(`
    {
      posts: allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    result.data.posts.edges.forEach(({node}) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve("./src/templates/post.js"),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.fields.slug,
        },
      })
    })
  })
}
