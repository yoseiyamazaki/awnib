/**
 * マークダウンファイルを直接Contentful Management APIでインポートするスクリプト
 *
 * 使い方:
 * 1. .envファイルにCONTENTFUL_MANAGEMENT_TOKENを追加
 * 2. node scripts/import-to-contentful.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const https = require('https');

// 環境変数から設定を読み込む
require('dotenv').config();

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const CONTENT_DIR = path.join(__dirname, '../content/blog');

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ エラー: CONTENTFUL_SPACE_IDとCONTENTFUL_MANAGEMENT_TOKENを.envファイルに設定してください');
  process.exit(1);
}

// マークダウンをContentful RichText形式に変換
function markdownToRichText(markdown) {
  const paragraphs = markdown
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  const content = paragraphs.map(paragraph => ({
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
  }));

  return {
    nodeType: 'document',
    data: {},
    content: content
  };
}

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

// Contentful Management APIにリクエストを送信
function makeRequest(method, urlPath, data = null, version = null, contentType = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${MANAGEMENT_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    };

    // Content-Typeヘッダーを追加（エントリ作成時に必要）
    if (contentType !== null) {
      headers['X-Contentful-Content-Type'] = contentType;
    }

    // バージョンヘッダーを追加（公開時に必要）
    if (version !== null) {
      headers['X-Contentful-Version'] = version;
    }

    const options = {
      hostname: 'api.contentful.com',
      path: urlPath,
      method: method,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// エントリを作成
async function createEntry(data) {
  const entry = {
    fields: {
      title: { 'ja': data.title },
      slug: { 'ja': data.slug },
      category: { 'ja': data.category },
      status: { 'ja': data.status },
      body: { 'ja': data.body }
    }
  };

  try {
    // エントリを作成（Content-Typeヘッダーを指定）
    const created = await makeRequest(
      'POST',
      `/spaces/${SPACE_ID}/environments/master/entries`,
      entry,
      null,  // version
      'post' // contentType
    );

    console.log(`  ✅ 作成: ${data.title} (ID: ${created.sys.id})`);

    // エントリを公開（バージョン番号を指定）
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit対策

    const published = await makeRequest(
      'PUT',
      `/spaces/${SPACE_ID}/environments/master/entries/${created.sys.id}/published`,
      null,
      created.sys.version  // バージョン番号を渡す
    );

    console.log(`  📢 公開: ${data.title}`);

    return published;
  } catch (error) {
    console.error(`  ❌ エラー (${data.title}):`, error.message);
    throw error;
  }
}

// メイン処理
async function main() {
  console.log('📝 マークダウンファイルをスキャン中...\n');

  const markdownFiles = getMarkdownFiles(CONTENT_DIR);
  console.log(`✅ ${markdownFiles.length}個のマークダウンファイルを発見しました\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const filePath of markdownFiles) {
    const relativePath = path.relative(CONTENT_DIR, filePath);
    console.log(`処理中: ${relativePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: body } = matter(content);

      const parts = relativePath.split(path.sep);
      const slug = parts[parts.length - 2] || path.basename(filePath, '.md');

      const data = {
        title: frontmatter.title || 'Untitled',
        slug: slug,
        category: frontmatter.category || 'post',
        status: frontmatter.status || 'public',
        body: markdownToRichText(body.trim())
      };

      await createEntry(data);
      successCount++;

      // Rate limit対策: 各リクエストの間に少し待つ
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ 失敗:`, error.message);
      errorCount++;
    }

    console.log('');
  }

  console.log('\n========================================');
  console.log(`✅ 完了: ${successCount}個のエントリを作成`);
  if (errorCount > 0) {
    console.log(`❌ エラー: ${errorCount}個のエントリが失敗`);
  }
  console.log('========================================\n');
}

// 実行
main().catch(error => {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
});
