以下のFigma URLのデザインを実装してください：$ARGUMENTS

## 手順

### 1. デザイン情報の取得
- `get_design_context` でデザインコンテキストとリファレンスコードを取得する
- `get_variable_defs` でデザイントークン（色、スペーシング等）を取得する
- ファイル中のアノテーションの内容を確認し、実装に必要な情報を把握する

### 2. 既存コードの確認
- `src/components/` 内の既存コンポーネントを確認し、再利用できるものがないか調べる
- `src/index.css` の `@theme` ブロックで定義済みのトークンを確認する
- `src/lib/utils.ts` の `cn()` 関数を必ず使用する

### 3. 実装
CLAUDE.md のガイドラインに厳密に従って実装すること：

**コンポーネント配置**
- 新規コンポーネントは `src/components/` に配置
- ファイル名はPascalCase（例: `HeroSection.tsx`）

**スタイリング**
- Tailwind CSS v4 構文を使用（`space-x/y-*` は使わず `gap-*` + flex/grid を使う）
- クラスの合成には必ず `cn()` を使用（`import { cn } from '@/lib/utils'`）
- 複数バリアントがある場合はCVA（`class-variance-authority`）を検討
- 複数の子要素にまたがるスタイルは `tailwind-variants` を検討
- アイコンは `lucide-react` を使用（インライン: `w-4 h-4`、見出し: `w-6 h-6`）

**TypeScript**
- `import React from 'react'` は書かない（react-jsx transform使用）
- フックは named import: `import { useState } from 'react'`
- propsは必ずTypeScriptのinterfaceで明示的に定義する
- `ComponentProps<'button'>` 等を使って既存HTML要素を拡張する

**アクセシビリティ**
- セマンティックなHTMLタグを使用（`header`, `main`, `section`, `nav` 等）
- `aria-label`, `aria-expanded`, `aria-controls` 等の適切なARIA属性を付与
- 画像には意味のある `alt` テキストを設定

**デザイントークン**
- Figmaから取得したトークンが `@theme` に未定義の場合、`src/index.css` に追加する
- 任意値（`w-[42px]`）は最終手段として使用し、複数箇所で使う場合は `@theme` に追加する

**画像アセット**
- Figma MCP の画像URL（`https://www.figma.com/api/mcp/asset/...`）は **7日間で失効** するため、必ずローカルに保存する
- `src/assets/images/` に `webp` 形式でダウンロードし、内容を表す kebab-case で命名する
  ```bash
  # 1枚ずつダウンロード
  curl -s -o src/assets/images/<name>.webp "<figma-asset-url>"

  # まとめてダウンロードする場合
  curl -s -o src/assets/images/hero.webp    "<url1>" \
  && curl -s -o src/assets/images/card-1.webp "<url2>" \
  && curl -s -o src/assets/images/card-2.webp "<url3>"
  ```
- コード内では直接URLを埋め込まず、`getImage()` で参照する
  ```tsx
  import { getImage } from '@/lib/image'

  // ❌ 直接URLを使わない
  <img src="https://www.figma.com/api/mcp/asset/..." />

  // ✅ getImage() で参照する
  <img src={getImage('hero')} alt="..." />
  ```

### 4. 完了確認
実装完了後、以下を確認してメッセージに含める：
- 作成・変更したファイルの一覧
- 新たに `@theme` に追加したトークン（あれば）
- 既存コンポーネントの再利用状況
- ダウンロードした画像ファイルの一覧（`src/assets/images/` に保存したもの）
- アノテーションで指定された要件をすべて満たしているか