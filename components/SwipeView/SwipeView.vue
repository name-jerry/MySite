<template>
  <view class="swipe-wrap">
    <text class="title">轮播图</text>
    <Swipe :list='swipeItemList' class="content" v-slot="{control}">
      <view class="control">
        <view class="button-group">
          <button @tap="control.prev()" class="icon hover-shadow-btn">&#xe611;</button>
          <button @tap="control.toggleRunStatus()"
            class="toggle hover-shadow-btn">{{control.isAutoRun?'关闭':'开启'}}轮播</button>
          <button @tap="control.clickNext()" class="icon hover-shadow-btn">&#xe611;</button>
        </view>
      </view>
    </Swipe>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
  import { swipeItemList } from "@/pojos/swipeItemList"
</script>

<style lang="scss" scoped>
  .swipe-wrap {
    font-size: inherit;
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: inherit;
    height: 100%;
    width: 100%;
    background-color: inherit;
    overflow: hidden;
    position: relative;

    .title {
      margin: 4px 0;
      display: grid;
      place-items: center;
      font-size: var(--fontSize-3);
    }

    .content {
      background-color: var(--color-bg-default);
    }

    &:hover .control {
      height: 100px;
      opacity: 1;
    }

    .control {
      transition: .25s ease;
      opacity: 0;
      height: 0;
      background-color: rebeccapurple;
      background: linear-gradient(#0000, #0008);
      position: absolute;
      overflow: hidden;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      display: grid;
      place-items: center;


      .button-group {
        display: flex;
        justify-content: center;
        gap: 10px;

        button {
          display: flex;
          align-items: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-bg-btn);
          color: white;
          margin: 0;

          &:last-child {
            transform: rotate(.5turn);
          }
        }

        .toggle {
          width: max-content;
          border-radius: 5px;
          padding: 0 10px;
        }
      }
    }


  }
</style>