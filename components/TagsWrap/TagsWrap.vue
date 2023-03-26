<template>
  <view class="tags-wrap container" :style="tagsWrapStyle">
    <template v-for="(item,i)  in tagList" :key="item._id">
      <Tag v-if="i<showTagsCount " class='tag-box hover-shadow-btn' :tag='item' @update='update' @remove="remove"></Tag>
    </template>
    <view v-show="showBtn" class="add tag-box hover-shadow-btn" :class="{'is-more':isMore}" @tap.native.stop='showMore'>
    </view>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
  import type { Article } from "@/type"
  import { getCurd } from "@/utils/getCurd"
  import useMainStore from "@/stores/useMainStore"
  // APP处读取artList内容,此处的getCurd受main.isOnLine影响
  let curdArt = getCurd < Article > ('articles');
  let main = useMainStore();
  let tagList = computed(() => main.artList.map(setTagByArticle));
  let tagsWrapStyle = reactive < {
    [key: string]: string,
  } > ({
    gap: '15px',
    '--tag-width': '150px'
  })
  let showTagsCount = ref < number > (0)
  let isMore = ref < boolean > (false)
  let showBtn = computed(() => tagList.value.length > (2 * column.value - 1))
  let column = ref < number > (0);

  function getShowColumn(): number {
    isMore.value = false
    let { windowWidth: wW } = uni.getSystemInfoSync() as UniNamespace.GetSystemInfoResult;
    let w: number;
    let g: number;
    if (wW <= 575) {
      wW -= 20
    } else if (wW <= 992) {
      wW -= 32
    } else if (wW <= 1200) {
      wW = 930 - 32
    } else if (wW > 1200) {
      wW = 1140 - 32
    }
    let { gap, '--tag-width': width } = tagsWrapStyle;
    g = +gap.replace('px', '');
    w = +width.replace('px', '');
    let c: number = ((wW + g) / (w + g)) | 0
    return c
  }

  function updateShowCount() {
    column.value = getShowColumn()
    showTagsCount.value = 2 * column.value - 1
  }

  function showMore() {
    showTagsCount.value = isMore.value ? 2 * column.value - 1 : Number.MAX_VALUE;
    isMore.value = !isMore.value
  }

  function setTagByArticle(v: Article) {
    return {
      _id: v._id,
      href: "/pages/Article/Article?title=" + v.title,
      title: v.title,
      sub: v.sub,
    }
  }

  function update(a: Article) {
    curdArt("update", a);
    const i: number = main.artList.findIndex((v) => {
      return v._id == "offLine" ? v.title == a.title : v._id == a._id
    })
    if (~i) main.artList[i] = { ...main.artList[i], ...a };
  }

  function remove(a: Article) {
    curdArt('remove', a)
    const i: number = main.artList.findIndex((v) => {
      return v._id == "offLine" ? v.title == a.title : v._id == a._id
    })
    if (~i) main.artList.splice(i, 1);
  }
  // =========挂载卸载============
  onMounted(() => {
    updateShowCount()
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
    justify-content: space-between;
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