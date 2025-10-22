import * as React from "react"
import { useEffect } from "react"
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
        // nodeの値を直接チェックしてHTMLタグが含まれているか確認
        const rawText = node.content
          .map(content => content.value || '')
          .join('');

        const htmlTagPattern = /<[^>]+>/;

        // HTMLタグが含まれている場合
        if (htmlTagPattern.test(rawText)) {
          return <p dangerouslySetInnerHTML={{ __html: rawText }} />
        }

        // 通常のテキスト処理（改行を<br />に変換）
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
