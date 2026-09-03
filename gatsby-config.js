/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

// Load environment variables
require("dotenv").config({
  path: `.env`,
})

const { documentToHtmlString } = require("@contentful/rich-text-html-renderer")
const { BLOCKS } = require("@contentful/rich-text-types")

const HTML_TAG_PATTERN = /<[^>]+>/

/**
 * ContentfulのRichText(raw JSON文字列)をHTMLに変換する。
 * 本文にHTMLを直接書いた段落はエスケープせずそのまま出力する
 * （src/templates/blog-post.js のレンダリングと揃えるため）
 */
const richTextToHtml = raw => {
  if (!raw) return ""
  try {
    return documentToHtmlString(JSON.parse(raw), {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) => {
          const rawText = node.content.map(c => c.value || "").join("")
          return HTML_TAG_PATTERN.test(rawText)
            ? `<p>${rawText}</p>`
            : `<p>${next(node.content).replace(/\n/g, "<br />")}</p>`
        },
      },
    })
  } catch (e) {
    return ""
  }
}

/** HTMLからタグを除いた抜粋を作る */
const excerpt = (html, length = 120) => {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > length ? `${text.slice(0, length)}...` : text
}

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
    // gatsby-source-contentful が必須プラグインとして要求する
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
              return allContentfulPost.nodes.map(node => {
                const html = richTextToHtml(node.body?.raw)
                return {
                  title: node.title,
                  description: excerpt(html),
                  date: node.date,
                  url: `${site.siteMetadata.siteUrl}/${node.slug}/`,
                  guid: `${site.siteMetadata.siteUrl}/${node.slug}/`,
                  custom_elements: [{ "content:encoded": html }],
                }
              })
            },
            query: `{
              allContentfulPost(
                sort: {date: DESC}
                filter: {category: {in: ["post", "global"]}}
              ) {
                nodes {
                  title
                  slug
                  category
                  date
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
