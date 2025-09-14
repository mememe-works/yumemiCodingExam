<script setup lang="ts"></script>

<template>
  <footer>
    <span> @2025 mememe-works </span>
  </footer>
</template>

<style lang="scss" scoped>
@import '../../assets/values.scss';

footer {
  padding: $SPACER $SPACER * 2;
  flex-shrink: 0;
  background-color: $COLOR_BACKGROUND_MUTED;
  text-align: center;
  font-family: 'Zen Maru Gothic';
  font-size: $FONT_SIZE_SMALL;
  @media (min-width: $MEDIA_MIN_WIDTH_TABLET) {
    padding: $SPACER * 2 $SPACER * 4;
  }
}
</style>
