<template>
  <view class="options-wrap" @tap.stop="$emit('select',$event.target.dataset.item)">
    <template v-for="item in props.options" :key="item">
      <view class="option" :data-item='item'>
        <text v-if='item.fontIcon' class="icon" v-html="item.fontIcon"></text>
        <text class="item-title">{{item.title?item.title:item}}</text>
      </view>
    </template>
    <Mask v-if='props.showMask' @tap.native.stop="$emit('cancel')"></Mask>
  </view>
</template>

<script setup lang="ts">
  import type { Option } from '@/type'
  let props = withDefaults(defineProps<{ options : Option[], showMask : boolean }>(), { options: () => [], showMask: true })
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
    text-shadow: initial;

    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5em;
      box-sizing: border-box;
      padding: .25em 1em;
      line-height: var(--lineHeight-2);
      border: 1px solid hsl(0, 0%, 80%);
      box-shadow: 0px 1px 0px hsl(0, 0%, 80%);
      z-index: 2;
      cursor: pointer;
      background-color: inherit;


      .item-title,
      .icon {
        pointer-events: none;
        white-space: nowrap;
      }

      &:hover {
        box-shadow: var(--shadow-btn-active);
      }

      &:active {
        box-shadow: var(--shadow-btn-active);
      }
    }
  }
</style>