# React + TypeScript + SWC + TanStack Router + Tailwind CSS

モダンな技術スタックを使用したReactアプリケーションのテンプレートです。

## 🚀 技術スタック

- **[React 19](https://react.dev/)** - UIライブラリ
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全な開発
- **[Vite 7](https://vite.dev/)** - 高速ビルドツール
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - SWCによる高速なFast Refresh
- **[TanStack Router](https://tanstack.com/router)** - 型安全なルーティング
- **[Tailwind CSS v4](https://tailwindcss.com/)** - ユーティリティファーストCSS
- **[Biome](https://biomejs.dev/)** - 高速なリンター・フォーマッター
- **[pnpm](https://pnpm.io/)** - 効率的なパッケージマネージャー

## 📁 プロジェクト構造

```
ts-swc/
├── public/              # 静的アセット
├── src/
│   ├── assets/         # 画像・フォントなど
│   │   └── images/     # 画像ファイル（jpg, png, webp, svg）
│   ├── components/     # 再利用可能なコンポーネント
│   │   └── ButtonCn.tsx
│   ├── lib/            # ユーティリティ関数
│   │   ├── image.ts         # 画像アセット管理（eager loading）
│   │   ├── imageAsync.ts    # 画像アセット管理（lazy loading）
│   │   └── utils.ts         # クラス名結合
│   ├── routes/         # TanStack Routerのルート定義
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── about.tsx
│   ├── index.css       # グローバルスタイル
│   ├── main.tsx        # エントリーポイント
│   └── routeTree.gen.ts # TanStack Router自動生成ファイル
├── biome.json          # Biome設定
├── mise.toml           # Mise設定（ツールバージョン管理）
├── package.json        # 依存関係
├── pnpm-lock.yaml      # pnpmロックファイル
├── pnpm-workspace.yaml # pnpmワークスペース設定
├── tsconfig.json       # TypeScript設定
├── tsconfig.app.json   # アプリ用TypeScript設定
├── tsconfig.node.json  # Node用TypeScript設定
└── vite.config.ts      # Vite設定
```

## 🛠️ セットアップ

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーが起動し、通常 http://localhost:5173 でアクセスできます。

## 📝 利用可能なコマンド

```bash
# 開発サーバー起動
pnpm dev

# プロダクションビルド
pnpm build

# ビルドしたアプリのプレビュー
pnpm preview

# コードのリント
pnpm lint

# コードのフォーマット
pnpm format

# リント + フォーマット
pnpm check
```

## 🎨 Tailwind CSS v4

このプロジェクトはTailwind CSS v4を使用しています。設定は [@tailwindcss/vite](https://tailwindcss.com/docs/guides/vite) プラグインを通じて行われます。

## 🧭 TanStack Router

TanStack Routerは自動的にルート定義を生成します。`src/routes/`配下にファイルを追加すると、自動的にルーティングが設定されます。

- `__root.tsx` - ルートレイアウト
- `index.tsx` - ホームページ（`/`）
- `about.tsx` - About ページ（`/about`）

開発時は [TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools) が利用可能です。

## 📦 主要な機能

- **型安全なルーティング** - TanStack Routerによる完全な型推論
- **高速なHMR** - SWCによる超高速なFast Refresh
- **自動コード分割** - TanStack Routerの自動コード分割機能
- **最適化された画像管理** - Viteの`import.meta.glob`による効率的なアセット読み込み
- **パスエイリアス** - `@/` で `src/` にアクセス可能
- **Biome統合** - ESLint + Prettierより高速なツールチェーン

## 🎨 Figma連携コマンド

Claude Code上でFigmaデザインをコードに変換するためのスラッシュコマンドです。
事前にFigma MCPサーバーが接続されている必要があります。

| コマンド | 説明 |
|---|---|
| `/figma:setup-env` | スターターのデモコンテンツを削除し、実装を始める前に一度だけ実行する |
| `/figma:implement-figma <URL>` | FigmaのURLを指定してデザインを実装する |
| `/figma:review-figma <URL>` | FigmaのURLを指定して実装とデザインを比較・修正する |
| `/figma:code-optim` | `src/components/` 内の実装済みコンポーネントをリファクタリングする |

### 典型的なワークフロー

```bash
# 1. 最初に一度だけ実行してデモコンテンツをクリア
/figma:setup-env

# 2. FigmaのURLを指定してデザインを実装
/figma:implement-figma https://www.figma.com/design/...

# 3. 実装とデザインを比較してレビュー・修正
/figma:review-figma https://www.figma.com/design/...

# 4. コンポーネントのリファクタリング
/figma:code-optim
```

## 🔧 カスタマイズ

### パスエイリアスの追加

[vite.config.ts](vite.config.ts) の `resolve.alias` セクションで追加のエイリアスを定義できます。

### コンポーネントライブラリ

このプロジェクトには、Tailwind CSSを使用したユーティリティが含まれています：

- `class-variance-authority` - バリアント管理
- `clsx` & `tailwind-merge` - クラス名の結合
- `tailwind-variants` - バリアント定義
- `lucide-react` - アイコンライブラリ
