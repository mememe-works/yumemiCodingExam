<template>
  <div :class="containerClass">
    <h2 :class="titleClass">Vue Emotion Example</h2>
    <p :class="descriptionClass">
      This component uses @egoist/vue-emotion with ESLint, Prettier, and TypeScript.
    </p>
    <button :class="buttonClass" @click="handleClick">Click me! ({{ clickCount }})</button>
    <div :class="cardClass">
      <h3 :class="cardTitleClass">Styled Card</h3>
      <p :class="cardTextClass">This is a styled card using Vue Emotion.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { css } from '@emotion/css'
import { ref } from 'vue'

const clickCount = ref(0)

const handleClick = () => {
  clickCount.value++
}

// Emotion CSS-in-JS styles
const containerClass = css`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const titleClass = css`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const descriptionClass = css`
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`

const buttonClass = css`
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const cardClass = css`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`

const cardTitleClass = css`
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const cardTextClass = css`
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
`
</script>
