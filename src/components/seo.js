/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"

const Seo = ({ description, title, children }) => {
  const { site, file } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            ogpImg
            ogpImgW
            ogpImgH
            lang
            locale
          }
        }
        file(name: { eq: "ogp" }) {
          publicURL
        }
      }
    `
  )

  const defaultLang = site.siteMetadata.lang
  const lang = defaultLang || `ja`

  const location = useLocation()
  const pagePath = location.pathname ? location.pathname : ""
  const defaultTitle = site.siteMetadata?.title
  const defaultDescription = site.siteMetadata?.description
  const metaTitle = defaultTitle ? `${title} | ${defaultTitle}` : title
  const metaDescription = description ? description : defaultDescription
  const siteUrl = site.siteMetadata?.siteUrl
  const metaUrl = pagePath ? `${siteUrl}${pagePath}` : `${siteUrl}`
  const metaType = pagePath ? `website` : `article`
  const defaultOgp = site.siteMetadata?.ogpImg
  const ogpImg = file.publicURL
  const ogpImgW = site.siteMetadata?.ogpImgW
  const ogpImgH = site.siteMetadata?.ogpImgH
  const metaOgpImg = ogpImg ? `${siteUrl}${ogpImg}` : `${siteUrl}${defaultOgp}`
  const metaOgpImgW = ogpImgW || `1200`
  const metaOgpImgH = ogpImgH || `630`
  const defaultLocale = site.siteMetadata.locale

  return (
    <>
      <html lang={lang} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaOgpImg} />
      <meta property="og:image:width" content={metaOgpImgW} />
      <meta property="og:image:height" content={metaOgpImgH} />
      <meta property="og:locale" content={defaultLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />

      <link rel="icon" href="/image/favicon.ico" />

      {children}
    </>
  )
}

export default Seo
