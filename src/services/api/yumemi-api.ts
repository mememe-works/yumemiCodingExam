/**
 * YUMEMI API
 * https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc
 */

import { env } from '@/config/env'
import { buildQueryParams } from './common'
import type {
  PrefecturesResponse,
  PopulationResponse,
  PopulationQueryParams,
} from '@/services/api/types/yumemi-api'

// ============================================================================
// エンドポイント定義
// ============================================================================
export const YUMEMI_API_BASE_URL = 'https://yumemi-frontend-engineer-codecheck-api.vercel.app'
export const YUMEMI_API_X_API_KEY = env.YUMEMI_X_API_KEY

export const YUMEMI_API_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
} as const

export const YUMEMI_API_ENDPOINTS = {
  // 都道府県一覧
  PREFECTURES: {
    path: `${YUMEMI_API_BASE_URL}/api/v1/prefectures`,
    method: 'GET' as const,
    headers: {
      accept: 'application/json',
      'X-API-KEY': YUMEMI_API_X_API_KEY,
    },
  },
  // 都道府県の人口データ
  POPULATION: {
    path: `${YUMEMI_API_BASE_URL}/api/v1/population/composition/perYear`,
    method: 'GET' as const,
    headers: {
      accept: 'application/json',
      'X-API-KEY': YUMEMI_API_X_API_KEY,
    },
  },
} as const

// ============================================================================
// API関数
// ============================================================================
export class YumemiApi {
  /**
   * 都道府県一覧を取得
   */
  static async getPrefectures(): Promise<PrefecturesResponse> {
    const response = await fetch(`${YUMEMI_API_ENDPOINTS.PREFECTURES.path}`, {
      method: YUMEMI_API_ENDPOINTS.PREFECTURES.method,
      headers: YUMEMI_API_ENDPOINTS.PREFECTURES.headers,
    })
    return response.json()
  }

  /**
   * 都道府県の人口データを取得
   * @param params
   */
  static async getPopulation(params: PopulationQueryParams): Promise<PopulationResponse> {
    const queryParams = buildQueryParams(params)
    const response = await fetch(
      `${YUMEMI_API_ENDPOINTS.POPULATION.path}?${queryParams.toString()}`,
      {
        method: YUMEMI_API_ENDPOINTS.POPULATION.method,
        headers: YUMEMI_API_ENDPOINTS.POPULATION.headers,
      },
    )
    return response.json()
  }
}
