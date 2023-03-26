<template>
  <view class="search-wrap">
    <view class="search-box hover-shadow-input" :class="{'blank':isBlank}">
      <input type="text" class="search" confirm-type="search" @confirm="enter" v-model='searchWord' @blur="blur"
        @focus="focusInput" />
      <Options class="options" :class="{show:showOptions}" :options='optionList' :show-mask='false' @select='select'>
      </Options>
      <picker @cancel="shrink=true" @change="pickerChange" @tap="pickerTap" mode="selector" :range='toolList'
        range-key="label" class="tools">
        <text>{{toolList[index].label}}</text>
      </picker>
      <a ref='btn' :href='toolList[index].value+searchWord' @tap='search' target='_blank' class="btn hover-shadow-btn">
        <text class="icon-search ">&#xe648;</text>
      </a>
    </view>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted, watch, computed } from "vue";
  import useMainStore from "@/stores/useMainStore"
  const main = useMainStore()
  let prop = defineProps < {
    autoShrink ? : boolean
  } > ()
  let shrink = ref < boolean > (true)
  const optionsKey = 'optionsKey'
  let toolList = reactive < { label: string, value: string } [] > ([
    { label: 'Can I Use', value: 'https://caniuse.com/?search=' },
    { label: 'bing', value: 'https://cn.bing.com/search?q=' },
    { label: '菜鸟教学', value: 'https://www.runoob.com/?s=' },
    { label: 'iconfont', value: 'https://www.iconfont.cn/search/index?searchType=icon&q=' },
  ])
  let searchWord = ref < string > ()
  let index = ref < number > (0)
  let optionList = ref < string[] > ([]);
  let showOptions = ref < boolean > (false);
  let isBlank = computed(() => !searchWord.value && prop.autoShrink && shrink.value)
  let btn = ref()

  function pickerChange(e: CustomEvent): void {
    index.value = e.detail.value;
    shrink.value = true
  }

  function pickerTap(): void {
    shrink.value = false
  }

  function focusInput() {
    showOptions.value = true
  }

  function enter(e) {
    btn.value.click()
  }

  function blur() {
    showOptions.value = false
  }

  function search(e: CustomEvent): void {
    if (isBlank.value) {
      e.preventDefault();
      uni.showToast({
        title: '输入文字',
        icon: "none"
      })
      return
    }
    let v = searchWord.value.replace(/(^\s+)|(\s+$)/g, '');
    if (v == '') return;
    addOption(v);
  }

  function select(item: string): void {
    searchWord.value = item
  }

  function setOptions(o: string[]): void {
    let set = new Set([...o])
    optionList.value = [...set]
    uni.setStorageSync(optionsKey, JSON.stringify(optionList.value))
  }

  function addOption(o: string) {
    let set = new Set([...optionList.value])
    set.add(o)
    optionList.value = [...set]
    uni.setStorageSync(optionsKey, JSON.stringify(optionList.value))
  }
  async function refresh() {
    if (!main.isLogin) return optionList.value = [];
    let l = uni.getStorageSync(optionsKey);
    if (l) return setOptions(JSON.parse(l))
  }
  onMounted(() => {
    watch(() => main.isLogin, refresh, { immediate: true })
  });
  onUnmounted(() => {})
</script>

<style scoped lang='scss'>
  .search-box {
    --height: 35px;
    z-index: 3;
    height: var(--height);
    border-radius: var(--height);
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 1fr calc(var(--height) * 1.3);
    align-items: center;
    background-color: var(--color-white);
    position: relative;
    transition: .25s linear;
    transform-origin: right bottom;
    margin-left: auto;

    .options {
      position: absolute;
      top: 100%;
      left: 50%;
      width: 100%;
      transform: translateX(-50%) scaleY(0);
      opacity: 0;
      transform-origin: top center;
      background-color: white;
      max-height: 100px;
      overflow-y: auto;
      overflow-x: hidden;
      transition: .25s linear .2s;


      &.show {
        transform: translateX(-50%);
        opacity: 1;
      }
    }

    .search {
      grid-column: 2;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding-left: .25em;
    }


    .tools {
      grid-column: 1;
      grid-row: 1;
      box-sizing: border-box;
      font-size: .75em;
      padding-left: .75em;
      padding-right: .3em;
      border-right: 1px solid rgba(0, 0, 0, .3);
      overflow: hidden;

      &:deep(span) {
        white-space: nowrap;
      }
    }

    .btn {
      position: absolute;
      right: 0;
      width: calc(var(--height) * 1.3);
      height: 100%;
      background-color: var(--color-bg-btn);
      color: white;
      border-radius: 0 var(--height) var(--height) 0;
    }
  }

  .search-box.blank {
    width: var(--height);
    opacity: .6;
    transform: scale(.8);

    .btn {
      width: var(--height);
      border-radius: 50%;
    }

    .options {
      display: none;
    }

    &:has(:hover, :focus-within) {
      width: 100%;
      opacity: 1;
      transform: none;

      .btn {
        width: calc(var(--height) * 1.3);
        border-radius: 0 var(--height) var(--height) 0;
      }

      .options {
        display: block;
      }
    }
  }
</style>