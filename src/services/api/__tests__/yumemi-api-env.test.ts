/**
 * 環境変数を含むYUMEMI APIテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { YumemiApi, YUMEMI_API_X_API_KEY } from '../yumemi-api'

// 環境変数をモック
vi.mock('@/config/env', () => ({
  env: {
    YUMEMI_X_API_KEY: 'test-api-key-123',
  },
}))

describe('YumemiApi with environment variables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('環境変数が正しく設定されている', () => {
    expect(YUMEMI_API_X_API_KEY).toBe('test-api-key-123')
  })

  it('APIキーがヘッダーに含まれる', async () => {
    // fetch のモック
    const mockFetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({
        message: 'success',
        result: [],
      }),
    })
    global.fetch = mockFetch

    // テスト実行
    await YumemiApi.getPrefectures()

    // 検証
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-API-KEY': 'test-api-key-123',
        }),
      }),
    )
  })
})
