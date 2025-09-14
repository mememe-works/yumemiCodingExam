<script setup lang="ts"></script>

<template>
  <header>
    <div class="header-title">ゆめみフロントエンドコーディング試験</div>
  </header>
</template>

<style lang="scss" scoped>
@import '../../assets/values.scss';

header {
  display: flex;
  flex-shrink: 0;
  padding: $SPACER $SPACER * 2;
  background-color: $COLOR_PRIMARY_BACKGROUND;

  @media (min-width: $MEDIA_MIN_WIDTH_TABLET) {
    padding: $SPACER * 2 $SPACER * 4;
  }

  .header-title {
    color: $COLOR_PRIMARY_TEXT;
    font-size: $FONT_SIZE_SMALL;
  }
}
</style>
