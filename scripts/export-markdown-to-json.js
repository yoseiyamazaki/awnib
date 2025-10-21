/**
 * マークダウンファイルをContentfulにインポートできるJSON形式に変換するスクリプト
 *
 * 使い方:
 * node scripts/export-markdown-to-json.js
 *
 * 出力: contentful-import.json
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// マークダウンをContentful RichText形式に変換
function markdownToRichText(markdown) {
  // シンプルな変換: 段落ごとに分割してRichTextノードを作成
  const paragraphs = markdown
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  const content = paragraphs.map(paragraph => {
    return {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: paragraph,
          marks: [],
          data: {}
        }
      ]
    };
  });

  return {
    nodeType: 'document',
    data: {},
    content: content
  };
}

const CONTENT_DIR = path.join(__dirname, '../content/blog');
const OUTPUT_FILE = path.join(__dirname, '../contentful-import.json');

// マークダウンファイルを再帰的に取得
function getMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  });

  return files;
}

// マークダウンファイルをContentful用のデータ構造に変換
function convertMarkdownToContentful(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  // ファイルパスからスラッグを生成
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const parts = relativePath.split(path.sep);
  const slug = parts[parts.length - 2] || path.basename(filePath, '.md');

  return {
    title: frontmatter.title || 'Untitled',
    slug: slug,
    category: frontmatter.category || 'post',
    status: frontmatter.status || 'public',
    body: markdownToRichText(body.trim()),
  };
}

// メイン処理
function main() {
  console.log('📝 マークダウンファイルをスキャン中...');

  const markdownFiles = getMarkdownFiles(CONTENT_DIR);
  console.log(`✅ ${markdownFiles.length}個のマークダウンファイルを発見しました`);

  const entries = markdownFiles.map((filePath, index) => {
    console.log(`  処理中: ${path.relative(CONTENT_DIR, filePath)}`);
    const data = convertMarkdownToContentful(filePath);

    return {
      sys: {
        id: `post${index + 1}`,
        type: 'Entry',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'post'
          }
        }
      },
      fields: {
        title: { 'en-US': data.title },
        slug: { 'en-US': data.slug },
        category: { 'en-US': data.category },
        status: { 'en-US': data.status },
        body: { 'en-US': data.body }
      }
    };
  });

  // Contentful Import形式の出力
  const output = {
    entries: entries,
    locales: [
      {
        code: 'en-US',
        name: 'English (United States)',
        fallbackCode: null,
        default: true
      }
    ]
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ 完了! データを ${OUTPUT_FILE} に出力しました`);
  console.log('\n次のステップ:');
  console.log('1. Contentful CLIをインストール: npm install -g contentful-cli');
  console.log('2. ログイン: contentful login');
  console.log('3. インポート: contentful space import --space-id YOUR_SPACE_ID --content-file contentful-import.json');
}

// 実行
try {
  main();
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}
