<h1 align="center">
  All we need is balance.
</h1>

Gatsby + Contentful で構築した個人ブログです。

## セットアップ

必要な環境: Node.js v18 以上

```bash
npm install
cp .env.example .env   # Contentful の認証情報を記入
npm run dev            # http://localhost:8000
```

GraphQL Playground: `http://localhost:8000/___graphql`

## コンテンツモデル

Content Type ID: `post`

| Field ID   | Type          | Required | 説明              |
| ---------- | ------------- | -------- | ----------------- |
| `title`    | Short text    | Yes      | 記事タイトル      |
| `slug`     | Short text    | Yes      | URL スラッグ      |
| `date`     | Date and time | Yes      | 投稿日            |
| `category` | Short text    | Yes      | `post` / `global` |
| `body`     | Rich text     | Yes      | 本文              |

公開・非公開は Contentful の Publish 状態で管理します（Draft / Unpublish のエントリはビルドに含まれません）。

`slug` は URL になるため、スペースや大文字を含めないでください。

## ビルド

```bash
npm run build   # public/ に出力
npm run serve   # ビルド結果をローカルで確認
npm run clean   # .cache と public を削除
```

## デプロイ

`master` への push、または Contentful の publish Webhook（`repository_dispatch: contentful_publish`）で
GitHub Actions が実行され、GitHub Pages へデプロイされます。設定は [.github/workflows/gatsby.yml](.github/workflows/gatsby.yml) を参照してください。

Contentful の認証情報は GitHub リポジトリの Secrets（`CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`）に設定します。

## トラブルシューティング

GraphQL のスキーマエラーが出る場合はキャッシュをクリアして再起動します。

```bash
npm run clean && npm run dev
```
