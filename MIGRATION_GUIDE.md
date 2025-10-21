# Contentful移行ガイド

このドキュメントでは、既存のマークダウンファイルからContentful CMSへの移行手順を説明します。

## 概要

このプロジェクトは、マークダウンベースのブログからContentful CMSベースのブログに移行しました。

### 移行された内容

- ✅ Contentful連携の設定
- ✅ GraphQLクエリのContentful対応
- ✅ テンプレートファイルの更新（Markdown/Contentful両対応）
- ✅ 環境変数の設定
- ✅ マークダウンからJSONへのエクスポートスクリプト

### 後方互換性

既存のマークダウンファイルも引き続き動作します。新旧のコンテンツソースを同時に使用できます。

## 移行手順

### ステップ 1: パッケージのインストール

```bash
npm install
```

新しく追加されたパッケージ:
- `gatsby-source-contentful` - Contentfulデータソースプラグイン
- `dotenv` - 環境変数管理
- `gray-matter` - マークダウンのフロントマター解析

### ステップ 2: Contentfulアカウントの設定

1. [Contentful](https://www.contentful.com/)にサインアップ
2. 新しいSpaceを作成
3. Content Modelを設定（詳細は[CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md)を参照）

### ステップ 3: 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して、Contentfulの認証情報を設定:

```bash
CONTENTFUL_SPACE_ID=あなたのSpace ID
CONTENTFUL_ACCESS_TOKEN=あなたのAccess Token
```

### ステップ 4: マークダウンコンテンツのエクスポート（オプション）

既存のマークダウンファイルをContentfulにインポートする場合:

```bash
node scripts/export-markdown-to-json.js
```

これにより`contentful-import.json`ファイルが生成されます。

### ステップ 5: Contentfulへのインポート

```bash
# Contentful CLIのインストール（グローバル）
npm install -g contentful-cli

# ログイン
contentful login

# Space IDを確認してインポート
contentful space import --space-id YOUR_SPACE_ID --content-file contentful-import.json
```

### ステップ 6: ビルドとテスト

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:8000 を開く

# GraphQLを確認
# http://localhost:8000/___graphql
```

## 新しいコンテンツの追加方法

### Contentfulで記事を追加

1. Contentfulダッシュボードにログイン
2. Content > Add entry > Post を選択
3. 必要なフィールドを入力:
   - **Title**: 記事タイトル
   - **Slug**: URLスラッグ（例: my-new-post）
   - **Category**: `post` または `global`（デフォルト: `post`）
   - **Status**: `public` または `private`（デフォルト: `private`）
   - **Body**: Rich Text形式で記事本文を入力
4. Publishをクリック

**注意**:
- 投稿日時は自動的にContentfulの`createdAt`が使用されます
- `description`フィールドは現在のモデルにはありません（SEOが必要な場合は後で追加可能）

### URLの形式

- Contentful記事: `/{category}/{slug}`
  - 例: `/post/my-new-post`
  - 例: `/global/about`
- Markdown記事（従来）: `/blog/{category}/{folder-name}/`
  - 例: `/blog/post/hello-world/`

## トラブルシューティング

### GraphQLエラーが発生する

**問題**: `Cannot query field "allContentfulPost"`

**解決策**:
1. `.env`ファイルが正しく設定されているか確認
2. Contentfulに少なくとも1つのPublishedエントリが存在するか確認
3. Content Type IDが正確に`post`であることを確認
4. `npm run clean`を実行してキャッシュをクリア
5. 再度`npm run dev`を実行

### Contentfulからデータが取得できない

**問題**: ページが表示されない、またはデータが空

**解決策**:
1. Space IDとAccess Tokenが正しいか確認
2. Content Type IDが正確に`post`であることを確認
3. Content Modelのフィールド名が正しいか確認:
   - `title` (Symbol)
   - `slug` (Symbol)
   - `category` (Symbol)
   - `status` (Symbol)
   - `body` (RichText)
4. Publishボタンを押してエントリを公開したか確認

### ビルドエラー

**問題**: `gatsby build`が失敗する

**解決策**:
1. すべての依存関係がインストールされているか確認: `npm install`
2. Node.jsのバージョンを確認（v18以上推奨）
3. キャッシュをクリア: `npm run clean && npm run build`

## さらなるカスタマイズ

### Rich Textのカスタムレンダリング

Rich Text形式の本文をカスタマイズしたい場合は、[src/templates/blog-post.js](src/templates/blog-post.js)の`renderRichText`オプションを編集してください。

```javascript
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="custom-paragraph">{children}</p>,
    // その他のカスタマイズ...
  }
}

renderRichText(post.body, options)
```

### プレビュー機能の有効化

Draft（下書き）コンテンツをプレビューしたい場合:

1. ContentfulでPreview API Tokenを取得
2. `.env`に追加:
   ```
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
   CONTENTFUL_HOST=preview.contentful.com
   ```

## 参考リンク

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Gatsby Source Contentful Plugin](https://www.gatsbyjs.com/plugins/gatsby-source-contentful/)
- [Contentful Rich Text](https://www.contentful.com/developers/docs/concepts/rich-text/)
- [Contentful CLI](https://github.com/contentful/contentful-cli)
