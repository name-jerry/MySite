<script setup lang="ts">
  import { ref, onMounted, reactive, computed } from "vue";
  const { tipList } = defineProps < { tipList: Tip[] } > ();
  // 用数字去判断分区,扩展性更强
  let tipNum = ref < number > (0);
  let move = computed < string > (() => `translateX(${-50 * tipNum.value}%)`);

  async function tipUpdate(tip: Tip): void {
    if (!tip.title) {
      let i: number = tipList.findIndex((item: Tip) => {
        return item.id == tip.id
      })
      tipList.splice(i, 1)
      return
    }
    tipList[tip.id] = tip;
  }
</script>

<template>
  <view class="memo">
    <text class="h3">备忘路</text>
    <!-- 用于实现切换 -->
    <view class="memo-content" :style="{ transform: move }">
      <!-- 未完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList" :key="item.id">
          <Tip class='tip' v-if="!item.isEnd" :tip="item" @update="tipUpdate"></Tip>
        </template>
      </view>
      <!-- 已完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList" :key="item.id">
          <Tip class='tip' v-if="item.isEnd" :tip="item" @update="tipUpdate"></Tip>
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

    .h3 {
      margin: 16px;
      display: grid;
      place-items: center;
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
        padding: 10px;
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


        // 等一下
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
  }
</style>
