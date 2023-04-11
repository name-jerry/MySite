<template>
  <view class="tags-wrap container" :style="tagsWrapStyle">
    <template v-for="(item,i)  in tagList" :key="item.title">
      <Tag :data-title="item.title" draggable="true" @dragstart='dragstart' @dragend='dragend' @dragenter='dragenter'
        @dragover='$event.preventDefault()' v-if="i<showTagsCount" :class="{dragging:item.title==draggingItem?.title}"
        class='tag-box hover-shadow-btn' :tag='item' @update='update' @remove="remove" @download='download'>
        <view class="count " v-show="item.updateCount">{{'未下载'}}</view>
      </Tag>
    </template>
    <view class="tag-box  button-group" :class="{'is-more':isMore}">
      <view class="icon new-file hover-shadow-btn " @tap.native.stop='newFile'>&#xe647;</view>
      <view class="add hover-shadow-btn " v-show="showBtn" @tap.native.stop='showMore'></view>
    </view>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
  import type { Article, Tag } from "@/type"
  import { getCurd } from "@/utils/getCurd"
  import useMainStore from "@/stores/useMainStore"
  import { downloadArt } from "@/tools/dowloadArt"
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
  /**控制是否显示 更多按钮*/
  let showBtn = computed(() => tagList.value.length > (2 * column.value - 1))
  let column = ref < number > (0);
  let draggingIndex = ref < number > (-1)
  let draggingItem = ref < Tag > ()

  // =========挂载卸载============
  onMounted(() => {
    updateShowCount()
    uni.onWindowResize(updateShowCount)
  })
  onUnmounted(() => {
    uni.offWindowResize(updateShowCount)
  })
  // =========拖拽=============
  function dragstart(event) {
    let target = event.target;
    let title = target.dataset.title;
    let i = main.artList.findIndex((v: Tag) => v.title == title);
    draggingIndex.value = i
    draggingItem.value = main.artList[i]
  }

  // 监听拖拽结束事件
  function dragend() {
    draggingIndex.value = -1;
    draggingItem.value = null;
  }
  // 监听进入事件,实现一个空出位置的效果
  function dragenter(event) {
    // 目标对象
    let target = event.currentTarget;
    let title = target.dataset.title;
    let targetIndex = main.artList.findIndex((v: Tag) => v.title == title);
    if (title == draggingItem.value.title) return;
    // 计算要移动的方向和距离
    const direction = targetIndex > draggingIndex.value ? 1 : -1;
    const distance = Math.abs(targetIndex - draggingIndex.value);
    // 遍历起点和终点间所有项目,将所有项与下一项互换
    for (let i = 0; i < distance; i++) {
      const swapIndex = draggingIndex.value + direction * i;
      const nextIndex = swapIndex + direction;
      // 互换
      [main.artList[swapIndex], main.artList[nextIndex]] = [main.artList[nextIndex], main
        .artList[swapIndex]
      ];
    }
    // 移动之后更新拖拽项的下标
    draggingIndex.value = targetIndex
  }


  // ========函数==============
  function download(tag: Tag) {
    const art = main.artList.find(a => a.title == tag.title)
    if (!art) return uni.showToast({
      title: '未知错误，保存失败',
      icon: 'error'
    });
    downloadArt(art);
    art.updateCount = false;
  }

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

  async function newFile() {
    let a: Article = {
      sub: 'newFile.md' + main.artList.length,
      title: 'newFile.md',
      content: ''
    }
    // 在线是同步到网络
    if (main.isOnline) {
      let res = await curdArt("add", a)
      a._id = res.id;
    } else {
      a._id = 'offLine';
    }
    main.artList.push(a);
  }

  function showMore() {
    showTagsCount.value = isMore.value ? 2 * column.value - 1 : Number.MAX_VALUE;
    isMore.value = !isMore.value
  }

  function setTagByArticle(v: Article) {
    let { _id, title, sub, updateCount } = v
    return {
      _id,
      href: "/pages/Article/Article?title=" + title,
      title,
      sub,
      updateCount
    }
  }

  function update(tag: Tag) {
    const i: number = main.artList.findIndex((v) => {
      return v._id == "offLine" ? v.sub == tag.sub : v._id == tag._id
    })
    if (!~i) throw new Error('本地存储中未找到这篇文章');
    const a = main.artList[i]
    a.title = tag.title
    curdArt("update", a);
  }

  function remove(tag: Tag) {
    const i: number = main.artList.findIndex((v) => {
      return v._id == "offLine" ? v.sub == tag.sub : v._id == tag._id
    })
    if (!~i) throw new Error('本地存储中未找到这篇文章');
    const a = main.artList[i]
    a.title = tag.title
    curdArt('remove', a)
    main.artList.splice(i, 1);
  }
</script>

<style scoped lang='scss'>
  @keyframes glow {
    from {
      transform: scale(.95);
      text-shadow: 0px 0px 1px hsl(146, 36%, 61%);
    }

    to {
      transform: scale(1.1);
      text-shadow: 4px 4px 1px hsl(146, 36%, 61%);
    }
  }

  .dragging {
    opacity: .5;
    border: 1px dashed gray;
  }

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
      border-radius: inherit;

      .count {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 10px;
        font-weight: 100;
        z-index: 4;
        color: #fff;
        transform-origin: center;
        -webkit-text-stroke: 1px hsl(144, 37%, 49%);
        animation: glow 1s ease-in-out infinite alternate;
      }
    }

    .button-group {
      overflow: hidden;
      display: flex;
      padding: 8px;
      gap: 8px;
      border: 4px solid white;
      box-shadow: -4px -4px 8px var(--color-white-1),
        6px 6px 12px var(--color-shadow-1),
        inset 4px 4px 8px var(--color-shadow-2),
        inset -6px -6px 12px var(--color-white-1);


      &>* {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit;
        background-color: inherit;
        border: 1px solid white;
        border-right-color: var(--color-shadow-1);
        border-bottom: var(--color-shadow-1);
      }

      .new-file {
        font-size: 28px;

        &:hover {
          color: var(--color-border-default);
          text-shadow: 0px 0px 1px var(--color-border-default), 0px 0px 50px var(--color-border-default);
        }
      }

      .add {
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
      }
    }

    .button-group.is-more>.add {
      &::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        transform: translate(-50%, -50%) rotate(135deg);
      }
    }
  }
</style>