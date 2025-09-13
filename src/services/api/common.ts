/**
 * API 共通関数
 */
export const buildQueryParams = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })
  return queryParams.toString()
}
