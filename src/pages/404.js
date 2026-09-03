import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Libraries } from "../components/libraries"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.siteTitle || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <div className="blog-post">
        <header>
          <h1>404: Not Found</h1>
        </header>
        <p>ここは静かで心地がいいですよ。</p>
      </div>
    </Layout>
  )
}

export const Head = ({ location }) => {
  return (
    <>
      <Seo pageTitle="404: Not Found" pagePath={location.pathname} />
      <Libraries />
    </>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        siteTitle
      }
    }
  }
`
