<template>
  <view class="container">
    <view class="search-box hover-shadow-input" style="--height:50px">
      <input type="text" class="search" confirm-type="search" @confirm="enter" v-model='searchWord'
        @focus="focusInput" />
      <Options v-show='showOptions' class="options" :options='options' :show-mask='false' @select='select'>
      </Options>
      <picker @change="(e:CustomEvent)=>{ index = e.detail.value}" mode="selector" :range='toolList' range-key="label"
        class="tools">
        <text>{{toolList[index].label}}</text>
      </picker>
      <a ref='btn' :href='toolList[index].value+searchWord' @tap='search' target='_blank' class="btn hover-shadow-btn">
        <text class="icon-search ">&#xe648;</text>
      </a>
    </view>
    <Mask style="z-index: 2;" @tap='blur'></Mask>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted } from "vue";
  import type { Option } from '@/type'
  const optionsKey = 'optionKey'
  let toolList = reactive < { label: string, value: string } [] > ([
    { label: 'Can I Use', value: 'https://caniuse.com/?search=' },
    { label: 'bing', value: 'https://cn.bing.com/search?q=' },
    { label: '菜鸟教学', value: 'https://www.runoob.com/?s=' },
    { label: 'iconfont', value: 'https://www.iconfont.cn/search/index?searchType=icon&q=' },
  ])
  let searchWord = ref < string | undefined | null > ('')
  let index = ref < number > (0)
  let options = ref < Option[] > (['']);
  let showOptions = ref < boolean > (false);
  let isFocus: Boolean = false;
  let btn = ref()

  function focusInput() {
    showOptions.value = true
    isFocus = true;
  }

  function enter(e) {
    btn.value.click()
  }

  function blur() {
    showOptions.value = false
    isFocus = false;
  }

  function search() {
    let v = searchWord.value.replace(/(^\s+)|(\s+$)/g, '')
    if (v == '') return;
    addOption(v);
    uni.setStorage({ key: optionsKey, data: options.value })
  }

  function select(item: Option): void {
    searchWord.value = item.title ? item.title : item
    showOptions.value = false
  }

  function setOptions(o: Option[]): void {
    let set = new Set([...o])
    options.value = [...set]
  }

  function addOption(o: Option) {
    let set = new Set([...options.value])
    set.add(o)
    options.value = [...set]
  }


  onMounted(() => {
    setOptions(uni.getStorageSync(optionsKey))
  })
  onUnmounted(() => {})
</script>

<style scoped lang='scss'>
  .container {
    width: 100%;

    * {
      z-index: 3;
    }

    .search-box {
      height: var(--height);
      margin: 0 auto;
      border-radius: var(--height);
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr auto calc(var(--height) * 1.3);
      background-color: var(--color-white);
      position: relative;

      .search {
        grid-column: 1;
        height: 100%;
        width: 100%;
        padding-left: 1em;
        box-sizing: border-box;
      }

      .options {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 60%;
        transform: translateX(-50%);
        background-color: white;
        max-height: 100px;
        overflow: auto;
      }



      .tools {
        grid-column: 2;
        box-sizing: border-box;
        line-height: var(--height);
        padding: 0 .5em;
      }

      .btn {
        grid-column: 3;
        width: 100%;
        height: 100%;
        background-color: var(--color-bg-btn);
        color: white;
        border-radius: 0 var(--height) var(--height) 0;
      }

    }
  }
</style>
