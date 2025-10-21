# Contentful モデル更新ガイド

## 変更内容

以下の変更を行います：

### 1. 新しいフィールド構造

| 変更前 | 変更後 | 理由 |
|--------|--------|------|
| `createdAt` (自動) | `date` (手動) | 投稿日を明示的に管理 |
| `category` (custom field) | `taxonomy` (custom field) | より適切な命名 |
| `status` (custom field) | Contentfulの公開状態 | Contentfulのネイティブ機能を活用 |

### 2. Contentful管理画面での設定手順

#### ステップ1: `date` フィールドを追加

1. Content model > **post** を開く
2. **Add field** をクリック
3. **Date and time** を選択
4. 設定:
   - Field name: `date`
   - Field ID: `date`
   - Required: **Yes**
   - Format: Date and time
5. **Create and configure** をクリック
6. **Save** をクリック

#### ステップ2: Taxonomy（Tags）を設定

Contentfulのネイティブな**Tags**機能を使用します。

1. Settings > Tags に移動
2. 以下のタグを作成:
   - タグ名: `post`
   - タグ名: `global`
3. Content model > **post** の設定で:
   - Sidebar widgets > **Tags** が有効になっていることを確認

**注意**: フィールドとしては追加不要です。Contentfulの組み込みTags機能を使用します。

#### ステップ3: 既存フィールドを削除

1. `category` フィールド:
   - 設定アイコンをクリック
   - **Delete** をクリック
   - 確認ダイアログで **Delete** をクリック

2. `status` フィールド:
   - 設定アイコンをクリック
   - **Delete** をクリック
   - 確認ダイアログで **Delete** をクリック

#### ステップ4: Content modelを保存

1. 右上の **Save** をクリック

### 3. 既存エントリの更新

すべての既存エントリに対して以下を実行：

1. Content > Entries に移動
2. 各エントリを開く
3. 新しいフィールド/タグを設定:
   - **date**: 投稿日時を設定（元の`createdAt`を参考に）
   - **Tags**: 右サイドバーで `post` または `global` タグを追加
4. **Publish** をクリック

### 4. 公開/非公開の管理

- **公開**: Contentfulの **Publish** ボタンで公開
- **下書き**: **Unpublish** または **Draft** 状態で保存
- `status` フィールドは不要（Contentfulのネイティブ機能で管理）

### 5. フィールド構造（最終版）

```
Post (Content Type ID: post)
├── title (Short text) - Required
├── slug (Short text) - Required
├── date (Date and time) - Required ← 新規追加
├── body (Rich text) - Required
└── metadata.tags (Contentful Tags) ← category から変更（システムフィールド）
    └── 使用可能なタグ: "post", "global"
```

**Note**: Tagsはフィールドではなく、Contentfulのメタデータとして管理されます。

## トラブルシューティング

### エントリが表示されない

- すべてのエントリが **Published** 状態になっているか確認
- `date` フィールドが設定されているか確認
- 適切なタグ（`post` または `global`）が設定されているか確認

### GraphQLエラーが出る

```bash
npm run clean
npm run dev
```

でキャッシュをクリアして再起動してください。
