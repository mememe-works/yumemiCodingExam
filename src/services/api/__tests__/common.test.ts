/**
 * API 共通関数のテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildQueryParams } from '../common'

describe('buildQueryParams', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('buildQueryParams', () => {
    it('正常にクエリパラメータを構築できる', async () => {
      const params = { param1: 1, param2: 'test' }
      const result = buildQueryParams(params)
      expect(result).toEqual('param1=1&param2=test')
    })

    it('空のパラメータでも正常に動作する', async () => {
      const params = { param1: 1, param2: undefined, param3: null, param4: 'test' }
      const result = buildQueryParams(params)
      expect(result).toEqual('param1=1&param4=test')
    })
  })
})
