`src/components/` 内の実装済みコンポーネントをリファクタリングして、再利用性と保守性を高めてください。

## 手順

### 1. 現状の把握
`src/components/` 内のファイルをすべて確認して以下を特定する：
- 重複しているスタイルやロジック
- ハードコードされた値（色、サイズ等）
- より適切なコンポーネントパターンに移行できるもの

### 2. コンポーネントパターンの最適化

CLAUDE.md の「Component Patterns」セクションに従い、各コンポーネントに最適なアプローチを選択する：

**cn 関数** — 条件分岐が少ないシンプルなコンポーネント
```tsx
import { cn } from '@/lib/utils'
className={cn('base-classes', condition && 'conditional-classes', className)}
```

**CVA（class-variance-authority）** — バリアントが複数ある単一要素コンポーネント（ボタン、バッジ等）
```tsx
import { cva, type VariantProps } from 'class-variance-authority'
const variants = cva('base', { variants: { intent: { ... }, size: { ... } } })
```

**tailwind-variants** — 複数の子要素にまたがるバリアントが必要なコンポーネント（カード、フォーム等）
```tsx
import { tv, type VariantProps } from 'tailwind-variants'
const component = tv({ slots: { base: '...', header: '...', content: '...' }, variants: { ... } })
```

### 3. デザイントークンの整理
- ハードコードされた色・スペーシング値を `src/index.css` の `@theme` ブロックに移動する
- 任意値（`w-[42px]`）を複数箇所で使っている場合はトークン化する
- トークン名はセマンティックに命名する（`--color-brand-primary` 等）

### 4. 共通パターンの抽出
- 3箇所以上で同じスタイルの組み合わせが使われていたら共通コンポーネント化を検討する
- ただし過度な抽象化は避ける（DRYより明快さを優先）

### 5. 型安全性の強化
- `any` 型をすべて排除する
- `ComponentProps<'element'>` を活用してHTML属性を継承する
- `className` propを受け取り `cn()` で外部からのオーバーライドを許容する

### 6. コードスタイルの最終確認
```bash
pnpm check
```
を実行してBiomeのルールに準拠していることを確認する。

### 7. 最適化結果の報告
以下をまとめて報告する：
- リファクタリングしたコンポーネントと変更内容
- `@theme` に追加・整理したトークン
- 新たに作成した共通コンポーネント（あれば）
- 選択したコンポーネントパターンとその理由
