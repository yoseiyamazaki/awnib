import * as React from "react"
import { graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Libraries } from "../components/libraries";

const BlogPostTemplate = ({
  data: { previous, next, site, contentfulPost },
  location,
}) => {
  const siteTitle = site.siteMetadata?.siteTitle || `Title`
  const post = contentfulPost

  // RichTextレンダリングオプション
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        // テキストノード内の改行を処理
        const processedChildren = React.Children.map(children, child => {
          if (typeof child === 'string') {
            return child.split('\n').map((text, i, arr) => (
              <React.Fragment key={i}>
                {text}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))
          }
          return child
        })
        return <p>{processedChildren}</p>
      },
    },
  }

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.date}</p>
        </header>
        <section itemProp="articleBody">
          {post.body && renderRichText(post.body, options)}
        </section>
      </article>
    </Layout>
  )
}
export default BlogPostTemplate

export const Head = ({ data, location }) => {
  const post = data.contentfulPost

  return (
    <>
      <Seo
        pageTitle={post.title}
        pageExcerpt={''}
        pagePath={location.pathname}
      />
       <Libraries />
    </>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        siteTitle
      }
    }
    contentfulPost(id: { eq: $id }) {
      id
      title
      slug
      category
      date(formatString: "MMMM DD, YYYY")
      updatedAt(formatString: "MMMM DD, YYYY")
      body {
        raw
      }
    }
    previous: contentfulPost(id: { eq: $previousPostId }) {
      slug
      category
      title
    }
    next: contentfulPost(id: { eq: $nextPostId }) {
      slug
      category
      title
    }
  }
`
