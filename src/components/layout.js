import * as React from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

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
      <Helmet>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/zax1sns.css"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;800;900&family=Shippori+Mincho:wght@700&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
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
