import * as React from "react"
import { useEffect } from "react"
import { graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Libraries } from "../components/libraries";

const MARK_TAGS = {
  [MARKS.BOLD]: "b",
  [MARKS.ITALIC]: "i",
  [MARKS.UNDERLINE]: "u",
  [MARKS.CODE]: "code",
}

// 実在するHTMLタグらしき記述だけにマッチさせる（「a < b > c」のような本文を誤検知しない）
const HTML_TAG_PATTERN = /<\/?[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?\/?>/

const collectText = node =>
  node.nodeType === "text"
    ? node.value || ""
    : (node.content || []).map(collectText).join("")

const containsHtmlTag = node => HTML_TAG_PATTERN.test(collectText(node))

// 生HTMLパス用。マークとリンクを保ったままHTML文字列にし、改行は<br />に変換する
const nodeToHtml = node => {
  if (node.nodeType === "text") {
    const html = (node.value || "").replace(/\n/g, "<br />")
    return (node.marks || []).reduce((acc, mark) => {
      const tag = MARK_TAGS[mark.type]
      return tag ? `<${tag}>${acc}</${tag}>` : acc
    }, html)
  }

  const inner = (node.content || []).map(nodeToHtml).join("")

  if (node.nodeType === INLINES.HYPERLINK) {
    return `<a href="${node.data.uri}">${inner}</a>`
  }

  return inner
}

// 太字やリンクでReact要素になった子も再帰的に辿って \n を <br /> に変換する
const insertLineBreaks = children =>
  React.Children.map(children, child => {
    if (typeof child === "string") {
      const parts = child.split("\n")
      return parts.map((text, i) => (
        <React.Fragment key={i}>
          {text}
          {i < parts.length - 1 && <br />}
        </React.Fragment>
      ))
    }

    if (React.isValidElement(child) && child.props.children) {
      return React.cloneElement(
        child,
        null,
        insertLineBreaks(child.props.children)
      )
    }

    return child
  })

const BlogPostTemplate = ({
  data: { previous, next, site, contentfulPost },
  location,
}) => {
  const siteTitle = site.siteMetadata?.siteTitle || `Title`
  const post = contentfulPost

  useEffect(() => {
    const articleBody = document.querySelector('[itemprop="articleBody"]');
    if (!articleBody) return;

    // 脚注セクションを特定
    const paragraphs = Array.from(articleBody.querySelectorAll('p'));
    const footnoteParagraph = paragraphs.find(p => p.textContent.includes('[^1]:'));

    if (!footnoteParagraph) return;

    // 脚注を分割・整形
    const footnoteContainer = document.createElement('div');
    footnoteContainer.className = 'footnotes';
    footnoteContainer.innerHTML = '<hr>';
    const footnoteList = document.createElement('ol');
    footnoteContainer.appendChild(footnoteList);

    const footnoteHTMLs = footnoteParagraph.innerHTML.split(/<br\s*\/?>/);

    footnoteHTMLs.forEach(html => {
      const trimmedHtml = html.trim();
      if (trimmedHtml) {
        const match = trimmedHtml.match(/\[\^(\d+)\]:/);
        if (match) {
          const fnNumber = match[1];
          const listItem = document.createElement('li');
          listItem.id = `fn${fnNumber}`;
          // '[^N]:' の部分を削除
          listItem.innerHTML = trimmedHtml.replace(/\[\^(\d+)\]:/, '').trim();
          footnoteList.appendChild(listItem);
        }
      }
    });

    // 元の脚注<p>を新しいコンテナで置き換え
    if (footnoteList.hasChildNodes()) {
      footnoteParagraph.parentNode.replaceChild(footnoteContainer, footnoteParagraph);
    }


    // 本文中の参照をリンク化 & 戻りリンクを追加
    paragraphs.forEach(p => {
      // 新しく作った脚注コンテナは対象外
      if (p === footnoteParagraph) return;

      p.innerHTML = p.innerHTML.replace(/\[\^(\d+)\](?!:)/g, (match, fnNumber) => {
        // 戻りリンクを脚注に追加
        const footnoteItem = document.getElementById(`fn${fnNumber}`);
        if (footnoteItem && !footnoteItem.querySelector('.footnote-backref')) {
          footnoteItem.innerHTML += ` <a href="#fnref${fnNumber}" class="footnote-backref" title="Jump back to footnote ${fnNumber} in the text">↩</a>`;
        }
        return `<sup id="fnref${fnNumber}"><a href="#fn${fnNumber}">${fnNumber}</a></sup>`;
      });
    });

  }, [contentfulPost]);

  // RichTextレンダリングオプション
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        // HTMLタグが直接書かれている段落だけ、生HTMLとして出力する
        if (containsHtmlTag(node)) {
          return <p dangerouslySetInnerHTML={{ __html: nodeToHtml(node) }} />
        }

        return <p>{insertLineBreaks(children)}</p>
      },
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1>{insertLineBreaks(children)}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2>{insertLineBreaks(children)}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3>{insertLineBreaks(children)}</h3>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4>{insertLineBreaks(children)}</h4>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <h5>{insertLineBreaks(children)}</h5>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <h6>{insertLineBreaks(children)}</h6>
      ),
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
