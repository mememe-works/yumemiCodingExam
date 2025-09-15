<script setup lang="ts">
import type { Prefecture } from '@/services/api/types/yumemi-api'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

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
  <details class="prefecture-list-wrapper" open>
    <summary>
      <h2>都道府県一覧</h2>
      <div class="prefecture-list-selected-count">
        {{ props.selectedPrefectures.length }}件選択中
      </div>
      <span class="prefecture-list-summary-arrow material-icons">arrow_right</span>
    </summary>
    <div class="prefecture-list-description">選択した都道府県の人口データを表示します</div>
    <div class="prefecture-list-content">
      <!-- ローディングオーバーレイ -->
      <LoadingOverlay :is-loading="props.loading" />
      <div v-if="props.error" class="common-text-error">エラー: {{ props.error }}</div>
      <div v-else class="prefectures-list">
        <div
          v-for="prefecture in prefectures"
          :key="prefecture.prefCode"
          class="prefecture-list-item"
        >
          <label>
            <input
              type="checkbox"
              :value="prefecture.prefCode"
              :checked="props.selectedPrefectures.includes(prefecture.prefCode)"
              @change="handlePrefectureChange(prefecture.prefCode, $event)"
            />
            <span class="prefecture-list-item-check-icon material-icons">check</span>
            {{ prefecture.prefName }}
          </label>
        </div>
      </div>
    </div>
  </details>
</template>

<style lang="scss" scoped>
@use '@/assets/values.scss' as v;
@use '@/assets/mixin.scss';

.prefecture-list-wrapper {
  position: relative;
  > summary {
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: v.$SPACER * 4;
    cursor: pointer;
    &::marker {
      content: '';
    }
    > h2 {
      @include mixin.headline_style();
    }
  }
  .prefecture-list-selected-count {
    @include mixin.text_description_style();
    flex: 1;
    text-align: right;
  }
  .prefecture-list-summary-arrow {
    color: v.$COLOR_TEXT_SOFT;
    transition: transform v.$TRANSITION_TIME ease;
    transform: rotate(90deg);
  }
  &:not([open]) {
    .prefecture-list-summary-arrow {
      transform: rotate(0deg);
    }
  }
  .prefecture-list-description {
    @include mixin.text_description_style();
    margin-bottom: v.$SPACER;
  }
  .prefecture-list-content {
    position: relative;
    max-height: calc(100vh - 300px);
    min-height: 300px;
    padding-top: v.$SPACER * 2;
    overflow: auto;
  }

  .prefectures-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: v.$SPACER * 2;
    padding: v.$SPACER * 2 0;
    @media (min-width: v.$MEDIA_MIN_WIDTH_TABLET) {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
  .prefecture-list-item {
    > label {
      display: flex;
      border-radius: v.$BORDER_RADIUS;
      min-height: v.$MIN_CLICKABLE_SIZE;
      width: 100%;
      height: 100%;
      padding: v.$SPACER;
      align-items: center;
      transition: background-color 0.2s;
      cursor: pointer;
      > input[type='checkbox'] {
        display: none;
      }
      .prefecture-list-item-check-icon {
        margin-right: v.$SPACER;
        font-size: v.$FONT_SIZE_SMALL;
        color: v.$COLOR_PRIMARY;
        visibility: hidden;
      }
      &:has(input[type='checkbox']:checked) {
        background-color: v.$COLOR_PRIMARY_BACKGROUND;
        .prefecture-list-item-check-icon {
          visibility: visible;
        }
      }
      &:hover {
        background-color: rgba(v.$COLOR_PRIMARY_BACKGROUND, 0.4);
      }
    }
  }
}
</style>
