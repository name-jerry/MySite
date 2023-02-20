<template>
  <view class="set" :class="{active:isCheck}" @tap.native.stop=' isCheck = !isCheck'>
    <view class="inner"></view>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted } from "vue";
  let isCheck = ref < boolean > (false)
  let { height } = defineProps < { height: string } > ()
</script>

<style scoped lang="scss">
  .set {
    --timing: .3s linear;
    --h: v-bind(height);
    --g: calc(var(--h) * .6);
    --endW: calc((var(--h) * 3 + (var(--g) + 2px) * 2) * 1.41);
    --c: gray;
    --endC: black;
    width: 70px;
    display: flex;
    flex-direction: column;
    gap: var(--g);

    &::before,
    &::after,
    .inner {
      content: '';
      width: 100%;
      height: var(--h);
      background-color: var(--c);
      border-radius: var(--h);
      transform-origin: left center;
      transition: var(--timing);
      border: 1px solid var(--endC);
      box-shadow: 0 0 0 1px var(--c);
      z-index: 10;
    }
  }

  .set.active {

    &::before,
    &::after,
    .inner {
      background-color: var(--endC);
      width: var(--endW);
      outline: 1px solid var(--c);
      box-shadow: 0 0 0 2px var(--endC);
    }

    .inner {
      transform: scaleX(0);
      opacity: 0;
    }

    &::before {
      transform: translateY(calc(var(--h) * -0.5)) rotate(45deg);
    }

    &::after {
      transform: translateY(calc(var(--h) * 0.5)) rotate(-45deg);
    }

  }
</style>
