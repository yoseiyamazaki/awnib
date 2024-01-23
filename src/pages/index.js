import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

import * as styles from "./index.module.scss"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  const postsByYear = data.allMarkdownRemark.edges.reduce((posts, { node }) => {
    const date = node.frontmatter.date
    let parts = date.split(" ")
    let year = parseInt(parts[0])

    if (!posts[year]) {
      posts[year] = []
    }
    posts[year].push(node)
    return posts
  }, {})

  console.log(postsByYear)

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div class={styles.postsGrid}>
        <h2>global</h2>
        <ol style={{ listStyle: `none` }}>
          {Object.keys(postsByYear)
            .reverse()
            .map(year =>
              postsByYear[year].map(post => {
                const title = post.frontmatter.title || post.fields.slug
                return post.frontmatter.category === "global" &&
                  post.frontmatter.status === "public" ? (
                  <li key={post.fields.slug}>
                    <article
                      className="post-list-item"
                      itemScope
                      itemType="http://schema.org/Article"
                    >
                      <header>
                        <h3>
                          <Link to={post.fields.slug} itemProp="url">
                            <span itemProp="headline">{title}</span>
                          </Link>
                        </h3>
                      </header>
                    </article>
                  </li>
                ) : null
              })
            )}
        </ol>
      </div>
      <div class={styles.postsGrid}>
        {Object.keys(postsByYear)
          .reverse()
          .map(year => {
            return (
              <>
                <h2 class={styles.label}>{year}</h2>
                <ol style={{ listStyle: `none` }}>
                  {postsByYear[year].map(post => {
                    const title = post.frontmatter.title || post.fields.slug
                    const date = post.frontmatter.date
                    let parts = date.split(" ")
                    let month = parts[1]
                    let day = parts[2]
                    return post.frontmatter.category === "post" &&
                      post.frontmatter.status === "public" ? (
                      <li key={post.fields.slug}>
                        <article
                          className="post-list-item"
                          itemScope
                          itemType="http://schema.org/Article"
                        >
                          <header>
                            <h3>
                              <Link to={post.fields.slug} itemProp="url">
                                <div class={styles.title} itemProp="headline">
                                  <span class={styles.day}>
                                    {month}-{day}
                                  </span>
                                  <span>{title}</span>
                                </div>
                              </Link>
                            </h3>
                          </header>
                        </article>
                      </li>
                    ) : null
                  })}
                </ol>
              </>
            )
          })}
      </div>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: { frontmatter: { status: { eq: "public" } } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          category
          date(formatString: "MM DD YYYY")
          title
          description
          status
        }
      }
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            category
            date(formatString: "YYYY MM DD")
            status
          }
        }
      }
    }
  }
`
