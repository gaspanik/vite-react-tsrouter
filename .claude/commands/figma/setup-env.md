Figmaデザインの実装を開始する前に、スターターのデモコンテンツをクリアします。

## 変更対象ファイル

以下の2ファイルを変更します。実行前に確認してください：

1. `src/routes/__root.tsx` — サンプルヘッダー・ナビゲーションを削除し、`<Outlet />` のみのミニマルなレイアウトにする
2. `src/routes/index.tsx` — スターターのデモコンテンツをクリアして空のページにする

## 手順

### 確認
まず現在のファイル内容を読み取り、「以下の変更を行います」と具体的に示してユーザーに確認を求めること。ユーザーが承認した場合のみ変更を実行すること。

### `src/routes/__root.tsx` の変更後イメージ
```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
```

### `src/routes/index.tsx` の変更後イメージ
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <main></main>
}
```

### 変更後の確認
変更完了後、以下を報告する：
- 変更したファイルの一覧
- 次のステップとして `/figma:implement-figma <Figma URL>` を実行するよう案内する
