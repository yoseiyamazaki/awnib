# Contentful セットアップガイド

## 1. Contentfulアカウントの作成

1. [Contentful](https://www.contentful.com/)にアクセスし、アカウントを作成します
2. 新しいSpaceを作成します（例: "awnib-blog"）

## 2. コンテンツモデルの設定

Contentfulの管理画面で以下のContent Typeを作成してください。

### Post (Content Type ID: `post`)

以下のフィールドを追加してください:

| Field Name | Field ID | Field Type | Required | Description |
|------------|----------|------------|----------|-------------|
| Title | `title` | Short text (Symbol) | Yes | 記事のタイトル |
| Slug | `slug` | Short text (Symbol) | Yes | URLスラッグ |
| Category | `category` | Short text (Symbol) | No | カテゴリ（post, global） |
| Status | `status` | Short text (Symbol) | Yes | 公開状態（private, public） |
| Body | `body` | Rich text | Yes | 記事本文 |

**注意**: `date`フィールドは不要です。Contentfulの`createdAt`（投稿日時）を自動的に使用します。

### フィールド設定の詳細

#### Title フィールド
- **Type**: Symbol (Short text)
- **Required**: Yes

#### Slug フィールド
- **Type**: Symbol (Short text)
- **Required**: Yes
- **Appearance**: URL slug（推奨）

#### Category フィールド
- **Type**: Symbol (Short text)
- **Required**: No
- **Appearance**: Dropdown
- **Predefined values**:
  - `post`
  - `global`
- **Default value**: `post`

#### Status フィールド
- **Type**: Symbol (Short text)
- **Required**: Yes
- **Appearance**: Dropdown
- **Predefined values**:
  - `public`
  - `private`
- **Default value**: `private`

#### Body フィールド
- **Type**: Rich text
- **Required**: Yes
- **Appearance**: Rich text editor
- **有効なマーク**: bold, italic, underline, code, superscript, subscript, strikethrough
- **有効なノードタイプ**: 見出し1-6, リスト, 引用, 埋め込みエントリ, アセット, リンク, テーブル, 水平線

## 3. APIキーの取得

1. Settings > API keys に移動
2. "Add API key" をクリック
3. 以下の情報を取得:
   - **Space ID**
   - **Content Delivery API - access token**
   - **Content Preview API - access token** (プレビュー機能を使う場合)

## 4. 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下を記入してください:

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
# プレビュー機能を使う場合（オプション）
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here
CONTENTFUL_HOST=preview.contentful.com
```

## 5. 既存のMarkdownコンテンツの移行

### 手動移行

1. Contentful管理画面で "Content" > "Add entry" > "Post" を選択
2. 各マークダウンファイルのフロントマターとコンテンツを入力
3. フィールドの対応:
   - `title` → Title
   - マークダウンファイル名 → Slug
   - `category` → Category
   - `status` → Status
   - 本文 → Body（Rich Textエディタで入力）

### 自動移行（推奨）

Contentful Import Toolを使用することで、JSONファイルからバルクインポートが可能です:

```bash
# Contentful CLIのインストール
npm install -g contentful-cli

# ログイン
contentful login

# インポート（JSON形式のデータが必要）
contentful space import --space-id YOUR_SPACE_ID --content-file ./contentful-import.json
```

## 6. パッケージのインストール

```bash
npm install
```

## 7. ビルドとテスト

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## トラブルシューティング

### GraphQLクエリエラー
- Contentfulのコンテンツモデルが正しく設定されているか確認
- フィールドIDが正確に一致しているか確認
- 少なくとも1つのPublishされたエントリが存在するか確認

### ビルドエラー
- `.env`ファイルが正しく設定されているか確認
- APIキーが有効か確認
- Space IDが正しいか確認

## 参考リンク

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [gatsby-source-contentful](https://www.gatsbyjs.com/plugins/gatsby-source-contentful/)
- [Contentful Rich Text](https://www.contentful.com/developers/docs/concepts/rich-text/)
