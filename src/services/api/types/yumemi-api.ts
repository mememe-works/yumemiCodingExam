/**
 * YUMEMI API の型定義
 * https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc
 */

// 都道府県関連の型
export interface Prefecture {
  prefCode: number
  prefName: string
}

export interface PrefecturesResponse {
  message: string
  result: Prefecture[]
}

// 人口データ関連の型
export interface PopulationData {
  year: number
  value: number
  rate: number
}

export interface PopulationComposition {
  label: string
  data: PopulationData[]
}

export interface PopulationResult {
  boundaryYear: number
  data: PopulationComposition[]
}

export interface PopulationResponse {
  message: string
  result: PopulationResult
}

// リクエストパラメータの型
export interface PopulationQueryParams {
  prefCode: number
}
