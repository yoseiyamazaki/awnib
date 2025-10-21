<h1 align="center">
  All we need is balance.
</h1>

## セットアップ

このブログはGatsbyで構築されており、コンテンツ管理にContentful CMSを使用しています。

### 必要な環境

- Node.js (v18以上推奨)
- npm または yarn
- Contentfulアカウント

### インストール

1. リポジトリをクローン

```bash
git clone [repository-url]
cd awnib
```

2. 依存パッケージをインストール

```bash
npm install
```

3. Contentful設定

詳細な設定方法は [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) を参照してください。

簡単な手順:
- [Contentful](https://www.contentful.com/)でアカウントを作成
- 新しいSpaceを作成
- Content Typeを設定（詳細はCONTENTFUL_SETUP.mdを参照）
- APIキーを取得

4. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、Contentfulの認証情報を設定してください。

```bash
cp .env.example .env
```

`.env`ファイルを編集:
```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

### 開発

開発サーバーを起動:

```bash
npm run dev
# または
npm start
```

ブラウザで `http://localhost:8000` を開きます。

GraphQL Playgroundはこちらからアクセスできます: `http://localhost:8000/___graphql`

### ビルド

```bash
npm run build
```

ビルドされたサイトは`public`ディレクトリに出力されます。

### デプロイ

```bash
npm run deploy
```

## 移行について

このプロジェクトはマークダウンファイルからContentful CMSに移行しました。
- 既存のマークダウンファイルは後方互換性のため残されています
- 新しいコンテンツはContentfulで管理されます
- マークダウンのコンテンツは`content/blog/`ディレクトリに保存されています

移行手順の詳細は [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) を参照してください。