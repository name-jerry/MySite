<template>
  <view class="my-input-wrap" :class="$attrs.class">
    <view class="my-input-box">
      <input class="my-input" type="safe-password" :password='!show' v-bind='filter($attrs)' />
    </view>
    <text class="my-icon" v-html="show?'&#xebcc;':'&#xebcd;'" @tap.native.stop="show=!show"></text>
  </view>
</template>
<script lang="ts">
  export default {
    inheritAttrs: false
  }
</script>
<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted } from "vue";
  let show = ref < boolean > (false)

  function filter(a: object) {
    const { class, ...params } = a
    return params
  }
</script>

<style scoped lang="scss">
  .my-input-wrap {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .my-input-box {
    overflow: hidden;
  }

  .my-input {
    width: calc(100% + 2em);
    height: 100%;
  }


  .my-icon {
    place-self: center;
    cursor: pointer;
    width: 1.2em;
    height: 1.2em;

    &:active {
      font-size: .8em;
    }
  }
</style>
