<script setup lang="ts">
interface Props {
  isLoading: boolean
  label?: string
  size?: string
}
const props = defineProps<Props>()
</script>

<template>
  <div v-if="props.isLoading" class="loading-overlay-wrapper">
    <div class="loading-overlay-contents">
      <div class="loading-overlay-spinner"></div>
      <p>{{ props.label ?? '読み込み中...' }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/values.scss' as v;

.loading-overlay-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(v.$COLOR_BACKGROUND_ACCENT, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  backdrop-filter: blur(2px);

  .loading-overlay-contents {
    text-align: center;
    color: v.$COLOR_PRIMARY_TEXT;
    > p {
      margin-top: v.$SPACER * 4;
      font-size: v.$FONT_SIZE_MEDIUM;
    }
  }
  .loading-overlay-spinner {
    width: v-bind('props.size ?? "40px"');
    height: v-bind('props.size ?? "40px"');
    border-width: 4px;
    border-style: solid;
    border-color: transparent rgba(v.$COLOR_PRIMARY, 0.5);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
