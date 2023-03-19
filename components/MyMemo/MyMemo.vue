<script setup lang="ts">
  import { ref, computed } from "vue";
  import type { Tip } from "@/type";
  import { getCurd } from "@/utils/getCurd";
  import useMainStore from "@/stores/useMainStore";
  import { useRefresh } from "@/utils/useRefresh"

  const tipsKey = "MyMemoTipsKey"
  let main = useMainStore()
  let curdTip = getCurd<Tip>('tip')
  let { list: tipList } = useRefresh<Tip>(curdTip, tipsKey)
  // 用数字去判断分区,扩展性更强
  let tipNum = ref<number>(0);
  let move = computed(() => `translateX(${-50 * tipNum.value}%)`) as unknown as string;
  let noItem = computed(() => tipList.value.length == 0)

  async function tipUpdate(tip : Tip) {
    let i : number = tipList.value.findIndex((item : Tip) => {
      return item._id == tip._id
    })
    if (!tip.title) {
      await curdTip("remove", tip)
      if (~i) tipList.value.splice(i, 1);
      return
    } else {
      let t = tipList.value[i];
      if (t.title == tip.title && t.is_end == tip.is_end) return;
      await curdTip("update", tip)
      tipList.value[i] = { ...t, ...tip };
    }

  }

  function addTip() {
    uni.showModal({
      editable: true,
      title: "输入内容",
      success: async (e) => {
        if (e.confirm) {
          let t : Tip = { title: e.content };
          let res = await curdTip("add", t);
          tipList.value.push({ _id: res.id, ...t });
        }
      }
    })
  }
</script>

<template>
  <view class="memo">
    <slot></slot>
    <text class="title">计划表</text>
    <!-- 用于实现切换 -->
    <view class="memo-content" :style="{transform: move }">
      <!-- 未完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList" :key="item._id">
          <Tip class='tip' v-if="!item.is_end" :tip="item" @update="tipUpdate"></Tip>
        </template>
      </view>
      <!-- 已完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList" :key="item._id">
          <Tip class='tip' v-if="item.is_end" :tip="item" @update="tipUpdate"></Tip>
        </template>
      </view>
    </view>
    <view class="group">
      <button :class="{ active: tipNum == 0 }" style="background-color: unset;" class="btn btn-primary"
        @click="tipNum = 0">
        待办
      </button>
      <button :class="{ active: tipNum == 1 }" style="background-color: unset;" class="btn btn-primary"
        @click="tipNum = 1">
        已结
      </button>
    </view>
    <!-- 增加按钮 -->
    <view class="add-btn icon" @tap="addTip" :class="{'no-item':noItem&&main.isLogin}">&#xe601;</view>
    <view v-show="!main.isLogin" class="refresh" @tap=" $emit('needLogin')">
    </view>
  </view>
</template>

<style scoped lang="scss">
  .memo {
    font-size: inherit;
    display: grid;
    grid-template-rows: auto 1fr auto;
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

    .memo-content {
      display: grid;
      width: 200%;
      grid-template-columns: repeat(2, 1fr);
      transition: var(--transition-default);
      overflow: hidden;

      .tips-wrap {
        background-color: var(--color-bg-default);
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 10px;
        overflow-y: auto;
        overflow-x: hidden;


        /* y对应width,x对应height */
        &::-webkit-scrollbar {
          width: 10px;
        }

        /* 轨道 */
        &::-webkit-scrollbar-track {
          box-shadow: var(--shadow-input-focus);
        }

        /* 滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          border: 1px solid var(--color-border-default);
          background-color: var(--color-1);
        }


        .tip {
          box-shadow: var(--shadow-btn-hover);
          flex: none;
        }

      }
    }



    // 按钮组
    .group {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, 1fr);
      overflow: hidden;
      padding: 8px;
      background-color: inherit;

      .btn {
        width: 100%;
        box-shadow: -1px -1px 2px hsl(199, 69%, 100%),
          2px 2px 4px hsl(199, 60%, 60%);
        border-radius: 6px;
      }

      .btn.active {
        box-shadow: inset 2px 2px 4px hsl(199, 60%, 60%),
          inset -1px -1px 1px hsl(199, 69%, 100%);
      }
    }

    // 增加
    .add-btn {
      position: absolute;
      background-color: var(--color-bg-pre);
      width: 40px;
      height: 40px;
      right: 8px;
      bottom: 48px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      font-size: 20px;
      --i: 8px;
      --c: var(--color-5);

      &.no-item {

        &::before,
        &::after {
          position: absolute;
          font-size: 14px;
          width: 5em;
          color: var(--color-font-default);
          bottom: calc(100% + 5px + var(--i));
        }

        &::before {
          content: '暂无计划,点击添加';
          background-color: var(--c);
          padding: 4px 0 0 10px;
          right: 0%;
        }

        &::after {
          content: '';
          border: var(--i) solid transparent;
          width: 0;
          right: 50%;
          bottom: calc(100% + 5px - var(--i));
          border-top-color: var(--c);
          transform: translateX(50%);
        }
      }
    }

    // 刷新
    .refresh {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, .2);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &::before,
      &::after {
        color: aliceblue;
        display: flex;
        font-size: 40px;
        line-height: 1;
        align-items: center;
        justify-content: center;
      }

      &::before {
        content: '\ed1f';
        font-family: "iconfont" !important;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        animation: rotate 2s linear infinite;
      }

      &::after {
        content: '请先登录';
        font-size: 16px;
        margin-top: 4px;
      }

      @keyframes rotate {
        to {
          transform: rotate(1turn);
        }
      }

    }
  }
</style>