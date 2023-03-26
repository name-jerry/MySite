<template>
  <div class="swipe-box">
    <!-- 轮播图 -->
    <div id="swipe">
      <template v-for="(item, index) in prop.list" :key="index">
        <SwipeItem :class="{ hidden: index >= 3 }" class="swipe-item" :item="item" target="-blank" />
      </template>
    </div>
    <slot :control="swipe"></slot>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import { Swipe } from "@/pojos/Swipe"
  import type { SwipeItem } from '@/type';
  import { useGetClientInfo } from "@/utils/useGetClientInfo"
  let prop = defineProps<{ list : SwipeItem[] }>();
  let { clientInfo } = useGetClientInfo("#swipe")
  let showColumns = ref<number>(3)
  let swipe = ref<Swipe>({});
  watch(clientInfo, updateShowColumnsByBoxWidth, { immediate: true })
  onMounted(() => {
    swipe.value = new Swipe(document.getElementById("swipe"));
    // 防刷新
    swipe.value.moveTo(0);
    window.addEventListener("resize", () => {
      swipe.value.moveTo(swipe.value.current);
    });
  });
  function updateShowColumnsByBoxWidth() {
    if (!clientInfo?.value?.width) return;
    let { width: w } = clientInfo.value;
    showColumns.value = w <= 768 ? 1 : 3;
  }
</script>

<style lang="scss" scoped>
  .swipe-box {
    --count: v-bind(showColumns);
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;

    #swipe {
      position: relative;
      display: grid;
      box-sizing: border-box;
      grid-auto-columns: calc(100% / var(--count));
      grid-auto-flow: column;
      height: 100%;

      .swipe-item {
        border-radius: 12px;
        padding: 0 10PX;
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
</style>