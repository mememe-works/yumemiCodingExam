<script setup lang="ts">
import type { Prefecture } from '@/services/api/types/yumemi-api'

interface Props {
  prefectures: Prefecture[]
  selectedPrefectures: number[]
  loading: boolean
  error: string | null
}

interface Emits {
  (e: 'prefecture-change', prefCode: number, event: Event): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handlePrefectureChange = (prefCode: number, event: Event) => {
  emit('prefecture-change', prefCode, event)
}
</script>

<template>
  <div class="prefecture-list">
    <h2>都道府県一覧</h2>

    <div v-if="props.loading" class="loading">読み込み中...</div>
    <div v-else-if="props.error" class="error">エラー: {{ props.error }}</div>
    <div v-else class="prefectures">
      <div v-for="prefecture in prefectures" :key="prefecture.prefCode" class="prefecture-item">
        <label class="prefecture-checkbox">
          <input
            type="checkbox"
            :value="prefecture.prefCode"
            :checked="props.selectedPrefectures.includes(prefecture.prefCode)"
            @change="handlePrefectureChange(prefecture.prefCode, $event)"
          />
          {{ prefecture.prefName }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prefecture-list {
  margin-bottom: 2rem;
}

.prefectures {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.prefecture-item {
  display: flex;
  align-items: center;
}

.prefecture-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.prefecture-checkbox:hover {
  background-color: #f5f5f5;
}

.prefecture-checkbox input[type='checkbox'] {
  margin-right: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>
