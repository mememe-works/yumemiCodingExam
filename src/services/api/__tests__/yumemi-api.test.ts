/**
 * YUMEMI API の単体テスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { YumemiApi } from '../yumemi-api'
import type { PrefecturesResponse, PopulationResponse } from '@/types/api/yumemi-api'

// 環境変数をモック
vi.mock('@/config/env', () => ({
  env: {
    YUMEMI_X_API_KEY: 'test-api-key-123',
  },
}))
// fetch のモック
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('YumemiApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getPrefectures', () => {
    it('都道府県一覧を正常に取得できる', async () => {
      const mockResponse: PrefecturesResponse = {
        message: 'success',
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
          { prefCode: 3, prefName: '岩手県' },
        ],
      }

      // fetch のモック設定
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      })
      // テスト実行
      const result = await YumemiApi.getPrefectures()
      // 検証
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': 'test-api-key-123',
          },
        },
      )
    })

    it('APIエラー時に例外を投げる', async () => {
      // エラーレスポンスのモック
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // テスト実行と検証
      await expect(YumemiApi.getPrefectures()).rejects.toThrow('Network error')
    })
  })

  describe('getPopulation', () => {
    it('人口データを正常に取得できる', async () => {
      // モックデータ
      const mockResponse: PopulationResponse = {
        message: 'success',
        result: {
          boundaryYear: 2020,
          data: [
            {
              label: '年少人口',
              data: [{ year: 1960, value: 1681479, rate: 33.37 }],
            },
          ],
        },
      }

      // テストパラメータ
      const params = { prefCode: 1 }

      // fetch のモック設定
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      })

      // テスト実行
      const result = await YumemiApi.getPopulation(params)

      // 検証
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=1',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': 'test-api-key-123',
          },
        },
      )
    })

    it('空のパラメータでも正常に動作する', async () => {
      // モックデータ
      const mockResponse: PopulationResponse = {
        message: 'success',
        result: { boundaryYear: 2020, data: [] },
      }
      // fetch のモック
      mockFetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      })
      // テストパラメータ
      const params = { prefCode: 1 }
      // テスト実行
      await YumemiApi.getPopulation(params)
      // 検証
      expect(mockFetch).toHaveBeenCalledWith(
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=1',
        expect.any(Object),
      )
    })
  })
})
