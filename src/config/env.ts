/**
 * 環境変数の型安全なアクセス
 */
export const env = {
  YUMEMI_X_API_KEY: import.meta.env.VITE_YUMEMI_X_API_KEY as string,
} as const
