import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export const Libraries = () => {
  const wp = useStaticQuery(graphql`
    query {
      appleTouchIcon: file(name: { eq: "apple-touch-icon" }) {
        publicURL
      }
      favicon32: file(name: { eq: "favicon-32x32" }) {
        publicURL
      }
      favicon16: file(name: { eq: "favicon-16x16" }) {
        publicURL
      }
      webManifest: file(name: { eq: "site" }) {
        publicURL
      }
      safariPinnedTab: file(name: { eq: "safari-pinned-tab" }) {
        publicURL
      }
    }
  `)

  return (
    <>
      <link rel="stylesheet" href="https://use.typekit.net/zax1sns.css"></link>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;800;900&family=Shippori+Mincho:wght@700&display=swap"
        rel="stylesheet"
      ></link>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={wp.appleTouchIcon.publicURL}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={wp.favicon32.publicURL}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={wp.favicon16.publicURL}
      />
      <link rel="manifest" href={wp.webManifest.publicURL} />
      <link
        rel="mask-icon"
        href={wp.safariPinnedTab.publicURL}
        color="#000000"
      />
      <meta name="msapplication-TileColor" content="#2d89ef" />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}
