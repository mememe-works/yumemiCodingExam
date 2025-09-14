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

interface Props {
  selectedPrefectures: number[]
  prefectures: Prefecture[]
  populationData: Record<number, PopulationResponse>
  loadingStates: Record<number, boolean>
}
const props = defineProps<Props>()
const dataTypes: { label: string; value: string; title: string }[] = [
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
const chartDataType = ref<(typeof dataTypes)[number]['value']>(dataTypes[0].value)
const getChartTitle = () => {
  return dataTypes.find((type) => type.value === chartDataType.value)?.title || '都道府県別人口推移'
}
// DataTypeに対応する都道府県の人口データを取得
const getPopulationDataByDataType = (
  data: PopulationResponse,
  dataType: string,
): PopulationData[] => {
  if (!data?.result?.data) return []
  const label = dataTypes.find((type) => type.value === dataType)?.label || ''
  return data.result.data.find((item) => item.label === label)?.data || []
}

// 都道府県名を取得
const getPrefectureName = (prefCode: number): string => {
  const prefecture = props.prefectures.find((p) => p.prefCode === prefCode)
  return prefecture?.prefName || `都道府県コード: ${prefCode}`
}

// Graphにすべきデータが選択されているかを判定
const hasSelectedPrefectures = computed(() => props.selectedPrefectures.length > 0)
// 読み込み中の都道府県があるかを判定
const isLoading = computed(() => {
  return props.selectedPrefectures.some((prefCode) => props.loadingStates[prefCode])
})

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
      position: 'top',
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
  scales: {
    x: {
      title: {
        display: true,
        text: '年',
      },
    },
    y: {
      title: {
        display: true,
        text: '人口数（万人）',
      },
      ticks: {
        callback: function (value) {
          return Number(value)
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
const chartColorsPalette = [
  '#1976d2',
  '#d32f2f',
  '#388e3c',
  '#f57c00',
  '#7b1fa2',
  '#00796b',
  '#5d4037',
  '#455a64',
  '#e91e63',
  '#ff9800',
  '#4caf50',
  '#9c27b0',
  '#ff5722',
  '#795548',
  '#607d8b',
]

const generateChartData = () => {
  if (!hasSelectedPrefectures.value) {
    chartData.value = {
      labels: [],
      datasets: [],
    }
    return
  }

  // X軸:年データを取得（selectedPrefecturesに登録されている都道府県の年データを統合）
  const allYears = new Set<number>()
  props.selectedPrefectures.forEach((prefCode) => {
    const data = props.populationData[prefCode]
    const populationData = getPopulationDataByDataType(data, chartDataType.value)
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
      const prefectureName = getPrefectureName(prefCode)
      const data = props.populationData[prefCode]
      const populationData = getPopulationDataByDataType(data, chartDataType.value)

      // データが存在しない場合はnull
      if (!populationData) {
        return null
      }

      const populationByYear = new Map<number, number>()
      populationData.forEach((item) => {
        populationByYear.set(item.year, item.value / 10000)
      })

      const chartDataPoints = sortedYears.map((year) => {
        return populationByYear.get(year) || null
      })

      return {
        label: prefectureName,
        data: chartDataPoints,
        borderColor: chartColorsPalette[index % chartColorsPalette.length],
        backgroundColor: chartColorsPalette[index % chartColorsPalette.length] + '20',
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
  <div class="population-graph">
    <h3>都道府県別人口推移グラフ</h3>
    <RadioGroup v-model="chartDataType">
      <RadioGroupLabel>表示データ</RadioGroupLabel>
      <RadioGroupOption v-slot="{ checked }" value="total">
        <span>総人口</span>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" value="young">
        <span> 年少人口 </span>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" value="working">
        <span> 生産年齢人口 </span>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" value="elderly">
        <span> 老年人口 </span>
      </RadioGroupOption>
    </RadioGroup>
    <div class="chart-container">
      <Line :data="chartData" :options="chartOptions" />

      <!-- ローディングオーバーレイ -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>データを読み込み中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.population-graph {
  margin-top: 2rem;
}

.chart-container {
  position: relative;
  height: 400px;
  margin: 1rem 0;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  text-align: center;
  color: #1976d2;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  margin: 0;
  font-weight: 500;
}

.no-selection {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    padding: 0.5rem;
  }
}
</style>
