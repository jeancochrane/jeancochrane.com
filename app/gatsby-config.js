module.exports = {
  siteMetadata: {
    title: "Jean Cochrane",
    description: "Jean Cochrane is a lead developer at DataMade focusing on infrastructure.",
    author: "@jeancochrane",
  },
  plugins: [
    // Manage changes to the document <head>
    // See: https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet/
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/src/posts`,
      },
    },
    // Image handling
    // See: https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-transformer-remark",
    // Ship site with a manifest file that allows it to be saved to a smartphone
    // See: https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png", // Replace this with a new icon
      },
    },
    // Enable Progressive Web App + Offline functionality
    // See: https://gatsby.dev/offline
    'gatsby-plugin-offline',
  ]
}
