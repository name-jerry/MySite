<template>
  <view class="tags-wrap container" :style="tagsWrapStyle">
    <template v-for="(item,key)  in tagList" :key="item.id">
      <Tag v-if='key<showTagsCount' class='tag-box hover-shadow-btn' :tag=' item'></Tag>
    </template>
    <view class="add tag-box hover-shadow-btn" @tap.native.stop=''>
      <text class="icon ">&#xed1e;</text>
    </view>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted } from "vue"

  let { tagList } = defineProps < {
    tagList: Tag[]
  } > ()
  let tagsWrapStyle = reactive < {
    [key: string]: string,
  } > ({
    gap: '20px',
    '--tag-width': '150px'
  })
  let showTagsCount = ref < number > (0)

  function updateShowCount() {
    let { windowWidth: wW } = uni.getSystemInfoSync() as UniNamespace.GetSystemInfoResult;
    let w: number;
    let g: number;
    if (wW <= 575) {
      wW -= 20
    } else if (wW <= 768) {
      wW = 540
    } else if (wW <= 992) {
      wW = 720
    } else if (wW <= 1200) {
      wW = 930
    } else if (wW > 1200) {
      wW = 1140
    }
    let { gap, '--tag-width': width } = tagsWrapStyle;
    g = +gap.replace('px', '');
    w = +width.replace('px', '');
    let c: number = ((wW + g) / (w + g)) | 0
    showTagsCount.value = 2 * c - 1
  }
  updateShowCount()
  // =========挂载卸载============
  onMounted(() => {
    uni.onWindowResize(updateShowCount)
  })
  onUnmounted(() => {
    uni.offWindowResize(updateShowCount)
  })
</script>

<style scoped lang='scss'>
  .tags-wrap {
    display: grid;
    box-sizing: border-box;
    grid-template: 68px/ repeat(auto-fit, var(--tag-width));
    grid-auto-rows: 68px;
    justify-content: center;
    position: relative;
    font-size: 15px;
    border-radius: var(--radius-16);

    .tag-box {
      background-color: var(--color-white);
      cursor: pointer;
    }

    .add {
      display: grid;
      place-items: center;
      border-radius: inherit;

      .icon {
        transform: rotate(45deg);
      }
    }
  }
</style>
