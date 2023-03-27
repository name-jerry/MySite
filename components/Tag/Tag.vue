<template>
  <view class="tag-box" :class="{'show-options':isShowOptions,'show-children':isShowChildren}" @tap="Toggle">
    <slot></slot>
    <a :href="prop.tag.href && !prop.tag.children ? prop.tag.href : 'javascript:void(0)'" class="card tag">
      <view class="text-content">
        <image v-if="prop.tag.src" :src="prop.tag.src" alt="" class="img"></image>
        <text v-if="prop.tag.title" class="lines" style="--lines: 2">{{ prop.tag.title }}</text>

      </view>
      <!-- hover时提示用的 -->
      <view class="sub-content" ref="sub" v-if="prop.tag.sub">
        {{ prop.tag.sub }}
      </view>
    </a>
    <!-- 有子类时渲染子类,js重置显示位置 -->
    <template v-if="prop.tag?.children&&prop.tag.children.length>0">
      <view class="children-wrap" ref="children" :style="childrenStyle">
        <Tag v-for="item in prop.tag.children" :tag="item" :key='item.id' class="item"></Tag>
      </view>
    </template>
    <!-- 点 -->
    <view class="dot-wrap">
      <view class="icon-dot hover-bg-color" @tap.native.stop="tapDot">&#xe623;</view>
      <Options class="options" :show-mask="false" :options="options" @select="select"></Options>
    </view>
    <!-- 遮罩 -->
    <view v-show='isShowShadow' data-shadow='true' class="shadow"></view>
  </view>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
  import { useGetClientInfo } from "@/utils/useGetClientInfo"
  import type { Tag } from '@/type';
  let prop = defineProps<{ tag : Tag, AutoMask ?: boolean }>();

  let childrenStyle : any = reactive({});
  // 兼容移动端
  let isShowChildren = ref<boolean>(false)
  let isShowShadow = ref<boolean>(false)
  let isShowOptions = ref<boolean>(false)
  // tag-box位置信息
  let { clientInfo } = useGetClientInfo('.tag-box')
  let options = ref<string[]>(["重命名", "删除", '下载']);
  let emit = defineEmits<{
    (e : "update", tag : Tag) : void
    (e : "remove", tag : Tag) : void
    (e : "download", tag : Tag) : void
  }>()
  async function updateName() {
    uni.showModal({
      editable: true,
      title: "请输入名字",
      success: async (e) => {
        if (e.confirm) {
          let a : Tag = { ...prop.tag, title: e.content };
          emit('update', a);
        }
      }
    })
  }
  function remove() {
    emit('remove', prop.tag);
  }
  function download() {
    emit('download', prop.tag)
  }
  let fns = new Map();
  fns.set("重命名", updateName)
  fns.set("删除", remove)
  fns.set("下载", download)
  function select(o : string) {
    blur();
    fns.has(o) && fns.get(o)()
  }
  function tapDot() : void {
    isShowOptions.value = true
    isShowShadow.value = true
    isShowChildren.value = false
  }
  function blur() {
    isShowChildren.value = false
    isShowShadow.value = false
    isShowOptions.value = false
  }
  // 兼容移动端
  function Toggle(e : CustomEvent) {
    let isShadow = (e.target as any).dataset?.shadow;
    if (isShadow) return blur();
    isShowChildren.value = true;
    isShowShadow.value = true;
    isShowOptions.value = false;
  }
  // 获取元素在窗口中的位置children-wrap位置
  function initChildrenStyle() {
    if (!prop.tag.children || prop.tag.children.length == 0) return;
    let { left: l, right: r, top: t, bottom: b } = clientInfo.value
    if (l > r) {
      childrenStyle.right = '101%'
      childrenStyle.left = 'initial'
    } else {
      childrenStyle.right = 'initial'
      childrenStyle.left = '101%'
    }
    if (t > b) {
      childrenStyle.bottom = '-10px'
      childrenStyle.top = 'initial'
    } else {
      childrenStyle.top = '-10px'
      childrenStyle.bottom = 'initial'
    }
  }

  // 位置变动时候更新一次位置
  onMounted(() => {
    watch(clientInfo, initChildrenStyle, { deep: true, immediate: true })
  });
  onUnmounted(() => {
    isShowChildren.value = false
  })
</script>
<style lang="scss" scoped>
  .tag-box {
    cursor: pointer;
    z-index: 1;
    position: relative;
    width: 100%;
    border-radius: inherit;

    &:hover {
      z-index: 2;
    }

    &.active {
      z-index: 2;
    }
  }

  .tag-box.active>.tag>.sub-content {
    display: block;
  }

  .navigator-wrap {
    width: 100%;
    border-radius: inherit;
  }

  .tag {
    width: 100%;
    height: 100%;
    z-index: 3;
    position: relative;
    transition: .25s ease;
    box-sizing: border-box;
    background-color: white;
    border-radius: inherit;
    overflow: hidden;

    .text-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      height: 68px;
      max-height: 68px;
      min-height: 68px;
    }

    .img {
      width: 32px;
      height: 32px;
    }
  }

  // 提示
  .sub-content {
    --bg: hsl(0, 0%, 85%);
    display: none;
    position: absolute;
    left: 0px;
    bottom: calc(100% + 12px);
    background-color: var(--bg);
    color: black;
    width: max-content;
    word-wrap: break-word;
    padding: 16px;
    font-family: kaiti, Times, serif;

    &::before {
      content: "";
      position: absolute;
      border: 10px solid white;
      border-color: var(--bg) transparent transparent transparent;
      bottom: -18px;
    }
  }

  .tag:hover>.sub-content {
    display: block;
  }

  .lines {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--lines);
    overflow: hidden;
  }

  // =====子类=========
  .children-wrap {
    position: absolute;
    display: none;
    width: 100%;
    z-index: 4;
    gap: 10px;
    border-radius: inherit;
    box-shadow: 0 0 5px rgb(0, 0, 0, .6);
    background-color: #e6e6e6;
    padding: 10px;
    left: 15px;
  }

  .tag-box:hover>.children-wrap,
  .show-children>.children-wrap {
    display: grid;
  }


  // ======点========

  .dot-wrap {
    --color: gray;
    position: absolute;
    box-sizing: border-box;
    top: 4px;
    right: 8px;
    z-index: 4;
    font-size: 10px;
    font-family: initial;
    text-shadow: none;

    .icon-dot {
      border-radius: 5px;
      height: 25px;
      width: 30px;
      display: grid;
      place-items: center;

      &:hover::after {
        content: '更多选项';
        position: absolute;
        white-space: nowrap;
        color: black;
        background-color: white;
        border: 1px black solid;
        padding: 2px 4px;
        left: 50%;
        bottom: 110%;
      }
    }
  }

  .options {
    display: none;
    position: absolute;
    left: 100%;
    top: 0%;
    flex-direction: column;
    width: max-content;
    background-color: white;
    color: black;
    font-family: inherit;
    box-shadow: var(--shadow-hover);

  }

  .show-options {
    z-index: 10;
  }

  .tag-box:hover>.dot-wrap,
  .show-options>.dot-wrap {
    display: block;
  }

  .show-options>.dot-wrap>.options {
    display: flex;
  }

  .show-options>.children-wrap {
    display: none !important;
  }

  // 阴影
  .shadow {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: rgb(0, 0, 0, .1);
  }
</style>