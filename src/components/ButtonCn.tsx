import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * `cn` 関数を使ったボタンコンポーネント例
 * 条件付きスタイルとクラスの結合をおこなう
 */

// buttonの標準Props（onClick, disabled等）を継承し、独自の `active` フラグを追加
type ButtonProps = ComponentProps<'button'> & {
  active?: boolean
}

export const Button = ({ className, active, disabled, children, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        // 1. ベースとなる共通スタイル
        'inline-flex items-center justify-center bg-zinc-100 px-4 py-2 border border-zinc-200 rounded-sm text-zinc-800 text-sm cursor-pointer',
        // 2a. 条件付きスタイル（activeがtrueの時のみ適用）
        active && 'bg-blue-500 text-blue-50 border-blue-500 hover:bg-blue-600',
        // 2b. 条件付きスタイル（disabledがtrueの時のみ適用）
        disabled && 'opacity-60 cursor-default',
        // 3. 上書き用スタイル（呼び出し元で指定された className を最優先
        className,
      )}
      // 残りの Props（onClick, disabled, aria-label等）をすべて展開
      {...props}
    >
      {children}
    </button>
  )
}
