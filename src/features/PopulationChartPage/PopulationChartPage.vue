<script setup lang="ts">
import PrefectureList from './components/PrefectureList.vue'
import PrefectureGraph from './components/PrefectureGraph.vue'

import { ref, onMounted } from 'vue'
import { YumemiApi } from '@/services/api/yumemi-api'
import type { Prefecture, PopulationResponse } from '@/services/api/types/yumemi-api'

const prefectures = ref<Prefecture[]>([])
const prefecturesLoading = ref(false)
const prefecturesError = ref<string | null>(null)
const selectedPrefecturesCodes = ref<number[]>([])

const populationData = ref<Record<number, PopulationResponse>>({})
const populationLoadingStates = ref<Record<number, boolean>>({})

// 都道府県一覧をload
const loadPrefectures = async () => {
  prefecturesLoading.value = true
  prefecturesError.value = null
  try {
    const response = await YumemiApi.getPrefectures()
    prefectures.value = response.result
  } catch (err) {
    prefecturesError.value = err instanceof Error ? err.message : '不明なエラーが発生しました'
    console.error('Prefectures API Error:', err)
  } finally {
    prefecturesLoading.value = false
  }
}

// 都道府県を選択した時の処理
const handlePrefectureChange = async (prefCode: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedPrefecturesCodes.value.push(prefCode)
    // データ未取得の場合は取得
    if (!populationData.value[prefCode]) {
      await loadPopulationData(prefCode)
    }
  } else {
    selectedPrefecturesCodes.value = selectedPrefecturesCodes.value.filter(
      (code) => code !== prefCode,
    )
  }
}
// 都道府県の人口データを取得
const loadPopulationData = async (prefCode: number) => {
  populationLoadingStates.value[prefCode] = true
  try {
    const response = await YumemiApi.getPopulation({ prefCode })
    populationData.value[prefCode] = response
  } catch (err) {
    console.error(`Population API Error for prefCode ${prefCode}:`, err)
    selectedPrefecturesCodes.value = selectedPrefecturesCodes.value.filter(
      (code) => code !== prefCode,
    )
  } finally {
    populationLoadingStates.value[prefCode] = false
  }
}

onMounted(() => {
  loadPrefectures()
})
</script>

<template>
  <div class="population-chart-page">
    <PrefectureList
      :prefectures="prefectures"
      :selected-prefectures="selectedPrefecturesCodes"
      :loading="prefecturesLoading"
      :error="prefecturesError"
      @prefecture-change="handlePrefectureChange"
    />

    <PrefectureGraph
      :selected-prefectures="selectedPrefecturesCodes"
      :prefectures="prefectures"
      :population-data="populationData"
      :loading-states="populationLoadingStates"
    />
  </div>
</template>

<style lang="scss" scoped>
.population-chart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
