/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

// Load environment variables
require("dotenv").config({
  path: `.env`,
})

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "",
  siteMetadata: {
    siteTitle: "All we need is balance.",
    siteDescription: "Hi. It is so personal blog.",
    siteUrl: "https://allweneedisbalance.com",
    facebookID: "",
    twitter: "",
    siteLang: `ja`,
    siteLocale: `ja_JP`,
    siteOgpImg: "/ogp.png",
    siteOgpImgW: 1200,
    siteOgpImgH: 630,
  },
  plugins: [
    `gatsby-plugin-image`,
    // Contentful Source Plugin
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST || `cdn.contentful.com`,
        enableTags: true,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteTitle
                siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allContentfulPost } }) => {
              return allContentfulPost.nodes.map(node => ({
                title: node.title,
                description: '',
                date: node.createdAt,
                url: `${site.siteMetadata.siteUrl}/${node.slug}`,
                guid: `${site.siteMetadata.siteUrl}/${node.slug}`,
                custom_elements: [{ "content:encoded": node.body?.raw || '' }],
              }))
            },
            query: `{
              allContentfulPost(
                sort: {createdAt: DESC}
                filter: {status: {ne: "private"}}
              ) {
                nodes {
                  title
                  slug
                  category
                  createdAt
                  body {
                    raw
                  }
                }
              }
            }`,
            output: "/rss.xml",
            title: "All we need is balance. RSS Feed",
          },
        ],
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-WWNW3E0Z04"],
        pluginConfig: {
          head: true,
        },
      },
    },
  ],
}
