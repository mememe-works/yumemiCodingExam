<script setup lang="ts"></script>

<template>
  <footer>
    <span> @2025 mememe-works </span>
  </footer>
</template>

<style lang="scss" scoped>
@use '../../assets/values.scss' as v;

footer {
  padding: v.$SPACER v.$SPACER * 2;
  flex-shrink: 0;
  background-color: v.$COLOR_BACKGROUND_MUTED;
  text-align: center;
  font-family: 'Zen Maru Gothic';
  font-size: v.$FONT_SIZE_SMALL;
  @media (min-width: v.$MEDIA_MIN_WIDTH_TABLET) {
    padding: v.$SPACER * 2 v.$SPACER * 4;
  }
}
</style>
