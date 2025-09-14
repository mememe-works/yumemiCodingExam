/**
 * PopulationChartPage のテスト
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PopulationChartPage from '../PopulationChartPage.vue'
import { YumemiApi } from '@/services/api/yumemi-api'
import type {
  Prefecture,
  PopulationResponse,
  PrefecturesResponse,
} from '@/services/api/types/yumemi-api'

// YumemiApi のモック
vi.mock('@/services/api/yumemi-api', () => ({
  YumemiApi: {
    getPrefectures: vi.fn(),
    getPopulation: vi.fn(),
  },
}))
// Chart.js のモック
vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    template: '<div data-testid="chart-line">Chart Component</div>',
  },
}))
// HeadlessUI のモック
vi.mock('@headlessui/vue', () => ({
  RadioGroup: {
    name: 'RadioGroup',
    template: '<div data-testid="radio-group"><slot /></div>',
  },
  RadioGroupLabel: {
    name: 'RadioGroupLabel',
    template: '<label data-testid="radio-group-label"><slot /></label>',
  },
  RadioGroupOption: {
    name: 'RadioGroupOption',
    template: '<div data-testid="radio-group-option"><slot /></div>',
  },
}))

describe('PopulationChartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('基本機能', () => {
    it('コンポーネントが正常にマウントされる', () => {
      const wrapper = mount(PopulationChartPage)
      expect(wrapper.exists()).toBe(true)
    })

    it('必要なコンポーネントが表示される', () => {
      const wrapper = mount(PopulationChartPage)
      expect(wrapper.findComponent({ name: 'PrefectureList' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'PrefectureGraph' }).exists()).toBe(true)
    })
  })
  describe('都道府県データ表示', () => {
    it('都道府県一覧が表示される', async () => {
      const mockPrefectures: Prefecture[] = [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' },
      ]
      vi.mocked(YumemiApi.getPrefectures).mockResolvedValueOnce({
        message: 'success',
        result: mockPrefectures,
      })

      const wrapper = mount(PopulationChartPage)
      await flushPromises()

      const prefectureList = wrapper.findComponent({ name: 'PrefectureList' })
      expect(prefectureList.text()).toContain('北海道')
      expect(prefectureList.text()).toContain('青森県')
    })

    it('エラー時にエラーメッセージを表示する', async () => {
      vi.mocked(YumemiApi.getPrefectures).mockRejectedValueOnce(new Error('API Error'))

      const wrapper = mount(PopulationChartPage)
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PrefectureList' }).text()).toContain(
        'エラー: API Error',
      )
    })
  })

  describe('都道府県選択', () => {
    // TODO: failing test
    it('都道府県選択時に人口データを取得する', async () => {
      const mockPrefectures: Prefecture[] = [{ prefCode: 1, prefName: '北海道' }]
      const mockPopulationData: PopulationResponse = {
        message: 'success',
        result: { boundaryYear: 2020, data: [] },
      }
      vi.mocked(YumemiApi.getPrefectures).mockResolvedValueOnce({
        message: 'success',
        result: mockPrefectures,
      })
      vi.mocked(YumemiApi.getPopulation).mockResolvedValueOnce(mockPopulationData)

      const wrapper = mount(PopulationChartPage)
      await flushPromises()

      const checkbox = wrapper
        .findComponent({ name: 'PrefectureList' })
        .find('input[type="checkbox"]')
      await checkbox.trigger('change')
      await flushPromises()
      await flushPromises()

      // APIが呼ばれたことを確認
      expect(YumemiApi.getPopulation).toHaveBeenCalledWith({ prefCode: 1 })
    })
  })

  describe('グラフ表示', () => {
    // TODO: failing test
    it('選択した都道府県のデータがグラフコンポーネントに渡される', async () => {
      const mockPrefectures: Prefecture[] = [{ prefCode: 1, prefName: '北海道' }]
      vi.mocked(YumemiApi.getPrefectures).mockResolvedValueOnce({
        message: 'success',
        result: mockPrefectures,
      })
      vi.mocked(YumemiApi.getPopulation).mockResolvedValueOnce({
        message: 'success',
        result: { boundaryYear: 2020, data: [] },
      })

      const wrapper = mount(PopulationChartPage)
      await flushPromises()

      // グラフコンポーネントが存在することを確認
      const graphComponent = wrapper.findComponent({ name: 'PrefectureGraph' })
      expect(graphComponent.exists()).toBe(true)
      // 初期状態ではデータは渡されていない
      expect(graphComponent.props('selectedPrefectures')).toEqual([])

      const checkbox = wrapper
        .findComponent({ name: 'PrefectureList' })
        .find('input[type="checkbox"]')
      // チェックボックスの初期状態を確認
      expect((checkbox.element as HTMLInputElement).checked).toBe(false)
      // チェックボックスを選択
      await checkbox.trigger('change')
      await flushPromises()
      // チェックボックスが選択されたことを確認
      expect((checkbox.element as HTMLInputElement).checked).toBe(true)

      // グラフコンポーネントにデータが渡されていることを確認
      expect(graphComponent.props('selectedPrefectures')).toContain(1)
      expect(graphComponent.props('populationData')).toHaveProperty('1')

      // 選択を解除
      await checkbox.trigger('change')
      await flushPromises()

      // グラフコンポーネントからデータが消えていることを確認
      expect(graphComponent.exists()).toBe(true)
      expect(graphComponent.props('selectedPrefectures')).not.toContain(1)
    })
    // TODO: failing test
    it('複数チェックすると複数グラフ描画される', async () => {
      const mockPrefectures: Prefecture[] = [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' },
      ]
      vi.mocked(YumemiApi.getPrefectures).mockResolvedValueOnce({
        message: 'success',
        result: mockPrefectures,
      })
      vi.mocked(YumemiApi.getPopulation).mockResolvedValueOnce({
        message: 'success',
        result: { boundaryYear: 2020, data: [] },
      })

      const wrapper = mount(PopulationChartPage)
      await flushPromises()
      const checkbox = wrapper
        .findComponent({ name: 'PrefectureList' })
        .find('input[type="checkbox"]')
      await checkbox.trigger('change')
      await flushPromises()
      const checkbox2 = wrapper
        .findComponent({ name: 'PrefectureList' })
        .find('input[type="checkbox"]')
      await checkbox2.trigger('change')
      await flushPromises()
      const graphComponent = wrapper.findComponent({ name: 'PrefectureGraph' })
      expect(graphComponent.exists()).toBe(true)
      expect(graphComponent.props('selectedPrefectures')).toContain(1)
      expect(graphComponent.props('selectedPrefectures')).toContain(2)
      expect(graphComponent.props('populationData')).toHaveProperty('1')
      expect(graphComponent.props('populationData')).toHaveProperty('2')
    })
  })

  // TODO
  describe('グラフ切り替え', () => {
    // ラジオボタンを切り替えるとグラフが切り替わる
    // ラジオボタンを切り替えるとタイトルが切り替わる
  })
})
