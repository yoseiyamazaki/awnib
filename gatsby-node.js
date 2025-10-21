/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all Contentful blog posts sorted by date
  const contentfulResult = await graphql(`
    {
      allContentfulPost(
        sort: { date: ASC }
        filter: { category: { in: ["post", "global"] } }
      ) {
        nodes {
          id
          slug
          category
        }
      }
    }
  `)

  if (contentfulResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading Contentful blog posts`,
      contentfulResult.errors
    )
    return
  }

  const contentfulPosts = contentfulResult.data.allContentfulPost.nodes

  // Create Contentful blog posts pages
  if (contentfulPosts.length > 0) {
    contentfulPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : contentfulPosts[index - 1].id
      const nextPostId = index === contentfulPosts.length - 1 ? null : contentfulPosts[index + 1].id

      createPage({
        path: `/${post.slug}`,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}
