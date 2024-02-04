import * as React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"

import * as styles from "./layout.module.scss"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <>
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <div className={styles.column}>
          <header className={`${styles.header} global-header`}>{header}</header>
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </>
  )
}

export default Layout

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        description
      }
    }
  }
`


