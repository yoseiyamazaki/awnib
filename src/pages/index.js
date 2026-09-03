import React, { useEffect } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Libraries } from "../components/libraries"

import * as styles from "./index.module.scss"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.siteTitle || `Title`

  const posts = data.allContentfulPost?.nodes || []

  useEffect(() => {
    var items = document.querySelectorAll(".skew")

    items.forEach(item => {
      if (item) {
        var matrix = window.getComputedStyle(item).transform
        var matrixArray = matrix.replace("matrix(", "").split(",")
        var scale = parseFloat(matrixArray[3])
        item.style.height = item.clientHeight * scale + "px"
      }
    })
  }, [])

  // Group posts by year ("YYYY MM DD")
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.date.split(" ")[0]
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  const years = Object.keys(postsByYear).reverse()

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className={styles.postsGrid}>
        <h2>global</h2>
        <ol style={{ listStyle: `none` }}>
          {years.map(year =>
            postsByYear[year]
              .filter(post => post.category === "global")
              .map(post => (
                <li key={post.slug}>
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <header>
                      <h3 className="skew">
                        <Link to={`/${post.slug}`} itemProp="url">
                          <span itemProp="headline">
                            {post.title || post.slug}
                          </span>
                        </Link>
                      </h3>
                    </header>
                  </article>
                </li>
              ))
          )}
        </ol>
      </div>
      <div className={styles.postsGrid}>
        {years.map(year => {
          const yearPosts = postsByYear[year].filter(
            post => post.category === "post"
          )
          return (
            <React.Fragment key={year}>
              <h2>{year}</h2>
              <ol style={{ listStyle: `none` }}>
                {yearPosts.map(post => {
                  const [, month, day] = post.date.split(" ")
                  return (
                    <li key={post.slug}>
                      <article
                        className="post-list-item"
                        itemScope
                        itemType="http://schema.org/Article"
                      >
                        <header>
                          <h3 className="skew">
                            <Link to={`/${post.slug}`} itemProp="url">
                              <div className={styles.title} itemProp="headline">
                                <span className={styles.day}>
                                  {month}-{day}
                                </span>
                                <span>{post.title || post.slug}</span>
                              </div>
                            </Link>
                          </h3>
                        </header>
                      </article>
                    </li>
                  )
                })}
              </ol>
            </React.Fragment>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        siteTitle
      }
    }
    allContentfulPost(sort: { date: DESC }) {
      nodes {
        id
        slug
        title
        category
        date(formatString: "YYYY MM DD")
      }
    }
  }
`

export const Head = ({ location }) => {
  return (
    <>
      <Seo pagePath={location.pathname} />
      <Libraries />
    </>
  )
}
