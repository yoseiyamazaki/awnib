# Contentful モデル更新ガイド（最終版）

## 変更内容

### 変更点まとめ

| フィールド | 変更前 | 変更後 |
|-----------|--------|--------|
| 日付 | `createdAt` (自動) | `date` (手動) |
| カテゴリ | `category` (custom) | `category` (変更なし) ✅ |
| 公開状態 | `status` (custom) | Contentfulの公開状態 |

## Contentful管理画面での設定手順

### ステップ1: `date` フィールドを追加

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

### ステップ2: `status` フィールドを削除

1. `status` フィールドの設定アイコンをクリック
2. **Delete** をクリック
3. 確認ダイアログで **Delete** をクリック

### ステップ3: Content modelを保存

1. 右上の **Save** をクリック

### ステップ4: 既存エントリを更新

すべての既存エントリに対して以下を実行：

1. Content > Entries に移動
2. 各エントリを開く
3. **date** フィールドに日付を設定（元の`createdAt`を参考に）
4. **Publish** をクリック

## 最終的なフィールド構造

```
Post (Content Type ID: post)
├── title (Short text) - Required
├── slug (Short text) - Required
├── date (Date and time) - Required ← 新規追加
├── category (Short text) - Required ← 変更なし
└── body (Rich text) - Required
```

## 公開/非公開の管理

- **公開済み**: Contentfulで **Publish** されたエントリ
- **下書き**: Draft状態または Unpublish されたエントリ
- GraphQLで`node.sys.publishedAt`の有無で判定

## トラブルシューティング

### エントリが表示されない

- すべてのエントリが **Published** 状態になっているか確認
- `date` フィールドが設定されているか確認

### GraphQLエラーが出る

```bash
npm run clean
npm run dev
```

でキャッシュをクリアして再起動してください。
