import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export const Seo = props => {
  const {
    pageTitle,
    pageExcerpt,
    pagePath,
    pageType,
    pageImage,
    pageImageW,
    pageImageH,
  } = props
  const {
    site: {
      siteMetadata: {
        siteTitle,
        siteDescription,
        siteUrl,
        facebookID,
        twitter,
        siteLang,
        siteLocale,
        siteOgpImg,
        siteOgpImgW,
        siteOgpImgH,
      },
    },
    file: { publicURL },
  } = useStaticQuery(graphql`
    query SeoQuery {
      site {
        siteMetadata {
          siteTitle
          siteDescription
          siteUrl
          facebookID
          twitter
          siteLang
          siteLocale
          siteOgpImg
          siteOgpImgW
          siteOgpImgH
        }
      }
      file(name: { eq: "ogp" }) {
        publicURL
      }
    }
  `)
  /*-- langの設定 --*/
  const lang = siteLang || `ja`
  /*-- タイトルの設定 --*/
  const metaTitle = pageTitle ? pageTitle + "｜" + siteTitle : siteTitle
  /*-- 説明文の設定 --*/
  const metaDescription = pageExcerpt
    ? pageExcerpt.length > 120
      ? pageExcerpt.slice(0, 120) + "..."
      : pageExcerpt
    : siteDescription
  /*-- ページURLの設定 --*/
  const metaUrl = pagePath ? `${siteUrl}${pagePath}` : `${siteUrl}`
  /*-- サイトのtypeの設定 --*/
  const metaType = pageType ? pageType : `article`
  /*-- OGP画像の設定 --*/
  let metaOgpImg = publicURL ? `${siteUrl}${publicURL}` : null
  let metaOgpImgW = 1200
  let metaOgpImgH = 630

  if (pageImage) {
    metaOgpImg = `${siteUrl}${pageImage}`
    if (pageImageW && pageImageH) {
      metaOgpImgW = pageImageW
      metaOgpImgH = pageImageH
    }
  }

  return (
    <>
      <html lang={lang} />
      {/* ページのタイトルや説明文、canical */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />
      {/* OGP */}
      <meta property="og:type" content={metaType} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaOgpImg} />
      <meta property="og:image:width" content={metaOgpImgW} />
      <meta property="og:image:height" content={metaOgpImgH} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={siteLocale} />
      <meta property="fb:app_id" content={facebookID} />
      {/* twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:site" content={twitter} />
    </>
  )
}

export default Seo
