<script setup lang="ts">
  import { onMounted, getCurrentInstance, ComponentInternalInstance, onUnmounted, reactive, ref } from "vue";
  import { getClientInfo, ClientInfo } from "@/utils/getClientInfo"

  let { tag } = defineProps < { tag: Tag } > ();
  let self: ComponentInternalInstance = getCurrentInstance() as ComponentInternalInstance
  let childrenStyle: any = reactive({});
  // 兼容移动端
  let isShowChildren = ref < boolean > (false)
  let isShowShadow = ref < boolean > (false)
  let isShowOptions = ref < boolean > (false)
  // tag-box位置信息
  let data: ClientInfo;
  const emit = defineEmits < {
    (e: 'dot', data: Tag)
  } > ()

  function tapDot(): void {
    isShowOptions.value = true
    isShowShadow.value = true
    isShowChildren.value = false
  }
  // 兼容移动端
  function Toggle(e: CustomEvent) {
    let isShadow = (e.target as any).dataset?.shadow;
    if (isShadow) {
      isShowChildren.value = false
      isShowShadow.value = false
      isShowOptions.value = false
    } else {
      initLeftAndWidth()
      isShowChildren.value = true
      isShowShadow.value = true
      isShowOptions.value = false
    }
  }
  // 获取元素在窗口中的位置children-wrap位置
  async function initLeftAndWidth() {
    if (!tag.children || tag.children.length == 0) return;
    data = await getClientInfo('.tag-box', self)
    let { clientLeft: l, clientRight: r, clientTop: t, clientBottom: b } = data
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
    initLeftAndWidth();
    uni.onWindowResize(initLeftAndWidth)
  });
  onUnmounted(() => {
    uni.offWindowResize(initLeftAndWidth)
    isShowChildren.value = false
  })
</script>
<template>
  <view class="tag-box" :class="{'show-options':isShowOptions,'show-children':isShowChildren}" @tap="Toggle">
    <a :href="tag.href && !tag.children ? tag.href : 'javascript:void(0)'"
      :target="tag.href && !tag.children ? '_blank' : ''" class="card tag">
      <view class="text-content">
        <img v-if="tag.src" :src="tag.src" alt="" />
        <p v-if="tag.title" class="lines" style="--lines: 2">{{ tag.title }}</p>
        <slot></slot>
      </view>
      <!-- hover时提示用的 -->
      <view class="sub-content" ref="sub" v-if="tag.sub">
        {{ tag.sub }}
      </view>
    </a>
    <!-- 有子类时渲染子类,js重置显示位置 -->
    <template v-if="tag?.children&&tag.children.length>0">
      <view class="children-wrap" ref="children" :style="childrenStyle">
        <Tag v-for="item in tag.children" :tag="item" :key='item.id' class="item"></Tag>
      </view>
    </template>
    <!-- 点 -->
    <view class="dot-wrap" @tap.native.stop="tapDot">
      <view class="icon-dot hover-bg-color">&#xe623;</view>
      <view class="options">
        <text class="options-item hover-bg-color">重命名</text>
        <text class="options-item hover-bg-color">删除</text>
      </view>
    </view>
    <!-- 遮罩 -->
    <view v-show='isShowShadow' data-shadow='true' class="shadow"></view>
  </view>
</template>

<style lang="scss" scoped>
  .tag-box {
    cursor: pointer;
    z-index: 1;
    position: relative;
    border-radius: inherit;
    width: 100%;

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

  .tag {
    width: 100%;
    height: 100%;
    z-index: 3;
    position: relative;
    transition: .25s ease;
    box-sizing: border-box;
    background-color: white;
    border-radius: inherit;

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

    img {
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
    border-radius: inherit;
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
    display: none;
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
        left: 101%;
        top: 101%;
      }
    }
  }

  .options {
    display: none;
    position: absolute;
    left: 0;
    top: 101%;
    flex-direction: column;
    width: max-content;
    background-color: white;
    color: black;
    font-family: inherit;
    box-shadow: var(--shadow-hover);

    .options-item {
      border-bottom: 1px solid hsla(0, 0%, 0%, .2);
      padding: 10px;
      padding-right: 20px;

      &:not(:last-of-type) {
        border-bottom: none;
      }

    }
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
    background-color: rgb(0, 0, 0, .4);
  }
</style>
