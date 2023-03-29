<template>
  <component is="label" class="switch-wrap" for="switch" :class="{checked:prop.checked}">
    <component is="input" type='checkbox' id="switch" :checked='prop.checked'>
    </component>
  </component>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
  const prop = defineProps<{ checked : boolean, width ?: number }>()
  const width = computed(() => (prop.width || 30) + 'px')
</script>

<style scoped lang="scss">
  .switch-wrap {
    --w: v-bind(width);
    --h: calc(var(--w) * .5);
    width: var(--w);
    height: var(--h);
    border-radius: var(--h);
    background-color: gray;
    position: relative;
    cursor: pointer;

    &::before,
    &::after {
      position: absolute;
      transition: .25s ease-in-out;
      display: grid;
      font-size: calc(var(--h) * .5);
      line-height: var(--h);
    }

    &::before {
      justify-items: center;
      content: attr(unchecked-text);
      color: inherit;
      background-color: #1981d5;
      border-radius: 50%;
      width: var(--h);
      height: var(--h);
      left: -1px;
      top: 0;
      z-index: 2;
    }

    &::after {
      content: attr(back-text);
      text-indent: calc(var(--w) / 2 - 2px);
      inset: 0;
      border-radius: inherit;
      background-color: hsl(345, 88%, 80%);
    }

    &.checked {
      &::before {
        content: attr(checked-text);
        left: calc(100% - var(--h) + 1px);
        background-color: #1E90FF;
        box-shadow: 0px 0px 5px #1E90FF, 0px 0 10px #1E90FF;
      }

      &::after {
        background-color: #83d4bf;
        text-indent: 2px;
      }

    }
  }

  #switch {
    display: none;
  }
</style>