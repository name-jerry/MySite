<template>
  <view class="options-wrap">
    <template v-for="item in options" :key="item.title">
      <view class="option" @tap="$emit('select',item)">
        <text v-if='item.fontIcon' class="icon" v-html="item.fontIcon"></text>
        <text class="item-title">{{item.title}}</text>
      </view>
    </template>
    <Mask @tap.native.stop="$emit('cancel')"></Mask>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted } from "vue";
  let { options } = defineProps < { options: Option[] } > ();
</script>

<style scoped lang="scss">
  .options-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: max-content;
    background-color: inherit;
    color: black;
    box-shadow: var(--shadow-btn);
    overflow: hidden;

    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5em;
      box-sizing: border-box;
      padding-left: .5em;
      padding-right: .5em;
      line-height: var(--lineHeight-2);
      box-shadow: 0px 1px 0px hsl(0, 0%, 80%);
      z-index: 2;
      cursor: pointer;
      background-color: inherit;

      .item-title,
      .icon {
        pointer-events: none;
      }

      &:active {
        box-shadow: var(--shadow-btn-active);
      }
    }
  }
</style>
