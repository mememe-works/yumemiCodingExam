<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type {
  Prefecture,
  PopulationResponse,
  PopulationData,
} from '@/services/api/types/yumemi-api'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

interface Props {
  selectedPrefectures: number[]
  prefectures: Prefecture[]
  populationData: Record<number, PopulationResponse>
  loadingStates: Record<number, boolean>
}
const props = defineProps<Props>()
// 読み込み中の都道府県があるかを判定
const isLoading = computed(() => {
  return props.selectedPrefectures.some((prefCode) => props.loadingStates[prefCode])
})

// ------------------------------------------------------------
// グラフデータの種類
const chartDataTypes: { label: string; value: string; title: string }[] = [
  {
    label: '総人口',
    value: 'total',
    title: '都道府県別総人口推移',
  },
  {
    label: '年少人口',
    value: 'young',
    title: '都道府県別年少人口推移',
  },
  {
    label: '生産年齢人口',
    value: 'working',
    title: '都道府県別生産年齢人口推移',
  },
  {
    label: '老年人口',
    value: 'elderly',
    title: '都道府県別老年人口推移',
  },
]
const chartDataType = ref<(typeof chartDataTypes)[number]['value']>(chartDataTypes[0].value)
const getChartTitle = () => {
  return (
    chartDataTypes.find((type) => type.value === chartDataType.value)?.title || '都道府県別人口推移'
  )
}
// ChartDataTypeに対応する都道府県の人口データを取得
const getPopulationDataByChatDataTypeValue = (
  data: PopulationResponse,
  chatDataTypeValue: string,
): PopulationData[] => {
  if (!data?.result?.data) return []
  const label = chartDataTypes.find((type) => type.value === chatDataTypeValue)?.label || ''
  return data.result.data.find((item) => item.label === label)?.data || []
}
// 都道府県名を取得
const getPrefectureNameByPrefCode = (prefCode: number): string => {
  const prefecture = props.prefectures.find((p) => p.prefCode === prefCode)
  return prefecture?.prefName || `都道府県コード: ${prefCode}`
}

// ------------------------------------------------------------
// Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const chartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: [],
})
const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: getChartTitle(),
    },
    legend: {
      display: true,
      position: 'bottom',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}万人`
        },
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}))
const chartColorsPalette = ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2', '#607d8b']
// Graphにすべきデータが選択されているかを判定
const hasSelectedPrefectures = computed(() => props.selectedPrefectures.length > 0)
const generateChartData = () => {
  if (!hasSelectedPrefectures.value) {
    chartData.value = {
      labels: [],
      datasets: [],
    }
    return
  }

  // X軸:年　選択した全てのデータの年を取得
  const allYears = new Set<number>()
  props.selectedPrefectures.forEach((prefCode) => {
    const data = props.populationData[prefCode]
    const populationData = getPopulationDataByChatDataTypeValue(data, chartDataType.value)
    if (populationData) {
      populationData.forEach((item) => {
        allYears.add(item.year)
      })
    }
  })
  const sortedYears = Array.from(allYears).sort()

  // Y軸:各都道府県の選択された人口データを取得
  const datasets = props.selectedPrefectures
    .map((prefCode, index) => {
      const data = props.populationData[prefCode]
      const populationData = getPopulationDataByChatDataTypeValue(data, chartDataType.value)
      // データが存在しない場合はnull
      if (!populationData) {
        return null
      }
      // 年ごとの人口データを取得
      const populationByYear = new Map<number, number>()
      populationData.forEach((item) => {
        populationByYear.set(item.year, item.value / 10000)
      })
      const chartDataPoints = sortedYears.map((year) => {
        return populationByYear.get(year) || null
      })

      const chartColor = chartColorsPalette[index % chartColorsPalette.length]
      return {
        label: getPrefectureNameByPrefCode(prefCode),
        data: chartDataPoints,
        borderColor: chartColor,
        backgroundColor: chartColor + '20', //alpha値を追加
        tension: 0.1,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    })
    .filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== null) // nullを除外

  // chartDataを更新
  chartData.value = {
    labels: sortedYears.map((year) => `${year}年`),
    datasets: datasets,
  }
}

watch(
  [
    () => props.selectedPrefectures,
    () => props.populationData,
    () => props.loadingStates,
    () => chartDataType.value,
  ],
  () => {
    nextTick(() => {
      generateChartData()
    })
  },
  { deep: true, immediate: true },
)
onMounted(() => {
  nextTick(() => {
    generateChartData()
  })
})
</script>

<template>
  <div class="population-graph-wrapper">
    <h2>都道府県別人口推移グラフ</h2>
    <RadioGroup v-model="chartDataType">
      <RadioGroupLabel :class="{ 'population-graph-data-type-radio-group-label': true }">
        表示データ
      </RadioGroupLabel>
      <div class="population-graph-data-type-radio-group-options">
        <RadioGroupOption
          :class="{ 'population-graph-data-type-radio-group-option': true }"
          value="total"
        >
          <span>総人口</span>
        </RadioGroupOption>
        <RadioGroupOption
          :class="{ 'population-graph-data-type-radio-group-option': true }"
          value="young"
        >
          <span> 年少人口 </span>
        </RadioGroupOption>
        <RadioGroupOption
          :class="{ 'population-graph-data-type-radio-group-option': true }"
          value="working"
        >
          <span> 生産年齢人口 </span>
        </RadioGroupOption>
        <RadioGroupOption
          :class="{ 'population-graph-data-type-radio-group-option': true }"
          value="elderly"
        >
          <span> 老年人口 </span>
        </RadioGroupOption>
      </div>
    </RadioGroup>
    <div class="population-graph-chart-wrapper">
      <div v-if="!hasSelectedPrefectures">
        <p class="common-text-note">都道府県を選択してください</p>
      </div>
      <div v-else>
        <Line :data="chartData" :options="chartOptions" />
        <!-- ローディングオーバーレイ -->
        <LoadingOverlay :is-loading="isLoading" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/values.scss' as v;
@use '@/assets/mixin.scss';

.population-graph-wrapper {
  display: flex;
  flex-direction: column;
  gap: v.$SPACER * 2;
  margin-top: v.$SPACER * 2;

  > h2 {
    @include mixin.headline_style();
    margin: 0 v.$SPACER * 2;
    @media (min-width: v.$MEDIA_MIN_WIDTH_TABLET) {
      margin: 0 v.$SPACER * 4;
    }
  }
  .population-graph-data-type-radio-group-label {
    display: none;
  }
  .population-graph-data-type-radio-group-options {
    display: flex;
    border: 1px solid v.$COLOR_BORDER;
    border-radius: v.$BORDER_RADIUS;
    background-color: v.$COLOR_BACKGROUND_MUTED;
  }
  .population-graph-data-type-radio-group-option {
    flex-basis: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: v.$BORDER_RADIUS;
    font-size: v.$FONT_SIZE_SMALL;
    min-height: v.$MIN_CLICKABLE_SIZE;
    min-width: v.$MIN_CLICKABLE_SIZE;
    padding: 0 v.$SPACER * 3;
    text-align: center;
    line-height: 1.2;
    &[aria-checked='true'] {
      background-color: v.$COLOR_BACKGROUND_ACCENT;
    }
  }
  .population-graph-chart-wrapper {
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      height: calc(100vh - 230px);
      min-height: 300px;
      max-height: 500px;
      border: 1px solid v.$COLOR_BORDER;
      border-radius: v.$BORDER_RADIUS;
      padding: v.$SPACER;
      background-color: v.$COLOR_BACKGROUND_ACCENT;
      overflow: hidden;

      @media (min-width: v.$MEDIA_MIN_WIDTH_TABLET) {
        padding: v.$SPACER * 2 v.$SPACER * 4;
      }
    }
  }
}
</style>
