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
    <h3>备忘路</h3>
    <!-- 用于实现切换 -->
    <view class="memo-content" :style="{ transform: move }">
      <!-- 未完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList">
          <Tip class='tip' v-if="!item.isEnd" :key="item.id" :tip="item" @update="tipUpdate"></Tip>
        </template>
      </view>
      <!-- 已完成 -->
      <view class="tips-wrap">
        <template v-for="item in tipList">
          <Tip class='tip' v-if="item.isEnd" :key="item.id" :tip="item" @update="tipUpdate"></Tip>
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
    width: 100%;
    border-radius: var(--radius-16);
    background-color: initial;
    overflow: hidden;


    h3 {
      font-size: var(--fontSize-3);
      line-height: 2;
      display: grid;
      place-items: center;
    }

    .memo-content {
      display: grid;
      width: 200%;
      grid-template-columns: repeat(2, 1fr);
      transition: var(--transition-1);
      overflow: hidden;

      .tips-wrap {
        background-color: var(--color-bg);
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-content: flex-start;
        gap: 10px;
        overflow-y: auto;

        /* y对应width,x对应height */
        &::-webkit-scrollbar {
          width: 10px;
        }

        /* 轨道 */
        &::-webkit-scrollbar-track {
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-input);
        }

        /* 滑块 */
        &::-webkit-scrollbar-thumb {
          background-color: var(--color-1);
          border-radius: var(--border-radius);
        }


        // 等一下
        .tip {
          background-color: white;
          flex: 1 1 250px;
          box-shadow: var(--shadow-btn-hover);
        }

      }
    }

    // 按钮组
    .group {
      display: grid;
      gap: 5px;
      grid-template-columns: repeat(2, 1fr);
      overflow: hidden;
      padding: 5px;

      .btn {
        width: 100%;
        box-shadow: -1px -1px 2px hsl(199, 69%, 100%),
          2px 2px 4px hsl(199, 60%, 60%);
        border-radius: var(--radius-8);
      }

      .btn.active {
        box-shadow: inset 2px 2px 4px hsl(199, 60%, 60%),
          inset -1px -1px 1px hsl(199, 69%, 100%);
      }
    }
  }
</style>
