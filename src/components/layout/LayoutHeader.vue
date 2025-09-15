<script setup lang="ts"></script>

<template>
  <header>
    <div class="header-title">ゆめみフロントエンドコーディング試験</div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/values.scss' as v;

header {
  position: sticky;
  top: 0;
  z-index: 1;

  display: flex;
  flex-shrink: 0;
  padding: v.$SPACER v.$SPACER * 2;
  background-color: v.$COLOR_PRIMARY_BACKGROUND;

  @media (min-width: v.$MEDIA_MIN_WIDTH_TABLET) {
    padding: v.$SPACER * 2 v.$SPACER * 4;
  }

  .header-title {
    color: v.$COLOR_PRIMARY_TEXT;
    font-size: v.$FONT_SIZE_SMALL;
  }
}
</style>
