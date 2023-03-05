<template>
  <view class="tags-wrap container" :style="tagsWrapStyle">
    <template v-for="(item,key)  in tagList" :key="item.id">
      <Tag v-if='key<showTagsCount' class='tag-box hover-shadow-btn' :tag=' item'></Tag>
    </template>
    <view class="add tag-box hover-shadow-btn" :class="{'is-more':isMore}" @tap.native.stop='showMore'>
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
  let isMore = ref < boolean > (false)
  let column: number;

  function getShowColumn(): number {
    isMore.value = false
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
    return c
  }

  function updateShowCount() {
    column = getShowColumn()
    showTagsCount.value = 2 * column - 1
  }
  updateShowCount()

  function showMore() {
    showTagsCount.value = isMore.value ? 2 * column - 1 : Number.MAX_VALUE;
    isMore.value = !isMore.value
  }
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
    grid-template: 68px/ repeat(auto-fill, var(--tag-width));
    grid-auto-rows: 68px;
    justify-content: center;
    position: relative;
    font-size: 15px;
    border-radius: 12px;
    padding-bottom: 20px;
    padding-top: 20px;

    .tag-box {
      background-color: white;
      cursor: pointer;
    }

    .add {
      border-radius: inherit;
      position: relative;

      &::before,
      &::after {
        content: '';
        width: 2px;
        height: 18px;
        background-color: black;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: .25s ease;
      }

      &::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }

      &.is-more {
        &::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        &::after {
          transform: translate(-50%, -50%) rotate(135deg);
        }
      }
    }
  }
</style>
