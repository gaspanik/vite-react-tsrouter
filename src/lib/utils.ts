import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// https://github.com/lukeed/clsx
// https://github.com/dcastil/tailwind-merge/
// https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper
// 複数のクラス名を結合し、Tailwind CSSの競合を解決するユーティリティ関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
