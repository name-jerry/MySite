<template>
  <component is="label" class="switch-wrap" for="switch" :class="{checked:prop.checked}" :s1='prop.checkedText[0]'
    :s2='prop.checkedText[1]' :uns1='prop.uncheckedText[0]' :uns2='prop.uncheckedText[1]'>
    <component is="input" type='checkbox' id="switch" :checked='prop.checked'>
    </component>
  </component>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
  const prop = defineProps<{ checked : boolean, width ?: number, checkedText : string, uncheckedText : string }>()
  const width = computed(() => (prop.width || 35) + 'px')
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
      line-height: var(--h);
      font-size: calc(var(--h) / 2);
    }

    &::before {
      justify-items: center;
      content: attr(uns1);
      color: inherit;
      background-color: #1a8ce3;
      border-radius: 50%;
      width: var(--h);
      height: var(--h);
      left: -1px;
      top: 0;
      z-index: 2;
    }

    &::after {
      content: attr(uns2);
      text-indent: calc(var(--w) / 2);
      inset: 0;
      border-radius: inherit;
      background-color: hsl(345, 88%, 80%);
    }

    &.checked {
      &::before {
        content: attr(s2);
        left: calc(100% - var(--h) + 1px);
        background-color: #1E90FF;
        box-shadow: 0px 0px 5px #1E90FF, 0px 0 10px #1E90FF;
      }

      &::after {
        content: attr(s1);
        background-color: #83d4bf;
        text-indent: 3px;
      }

    }
  }

  #switch {
    display: none;
  }
</style>