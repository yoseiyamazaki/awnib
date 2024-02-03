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
    wp: {
      generalSettings: { title, description },
    },
    site: {
      siteMetadata: {
        defaultTitle,
        defaultDescription,
        defaultSiteUrl,
        facebookID,
        twitter,
        defaultLang,
        defaultLocale,
        defaultOgpImg,
        defaultOgpImgW,
        defaultOgpImgH,
      },
    },
    file: { publicURL },
  } = useStaticQuery(graphql`
    query SeoQuery {
      site {
        siteMetadata {
          defaultTitle
          defaultDescription
          defaultSiteUrl
          twitter
          defaultLang
          defaultLocale
          defaultOgpImg
          defaultOgpImgW
          defaultOgpImgH
        }
      }
      file(name: { eq: "ogp" }) {
        publicURL
      }
    }
  `)
  /*-- langの設定 --*/
  const lang = defaultLang || `ja`
  /*-- タイトルの設定 --*/
  const siteName = title || defaultTitle
  const metaTitle = pageTitle ? pageTitle + "｜" + siteName : siteName
  /*-- 説明文の設定 --*/
  const siteDescription = description ? description : defaultDescription
  const metaDescription = pageExcerpt
    ? pageExcerpt.length > 120
      ? pageExcerpt.slice(0, 120) + "..."
      : pageExcerpt
    : siteDescription
  /*-- ページURLの設定 --*/
  const siteUrl = defaultSiteUrl
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
      <html lang="ja" />
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
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={defaultLocale} />
      <meta property="fb:app_id" content={facebookID} />
      {/* twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:site" content={twitter} />
    </>
  )
}
