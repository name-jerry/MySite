<template>
  <view class="container">
    <view class="search-box hover-shadow-input" style="--height:50px">
      <input type="text" class="search" v-model='searchWord' />
      <picker @change="(e:CustomEvent)=>{ index = e.detail.value}" mode="selector" :range='toolList' range-key="label"
        class="tools">
        <text>{{toolList[index].label}}</text>
      </picker>
      <navigator :url='toolList[index].value+searchWord' class="btn hover-shadow-btn">
        <text class="icon-search ">&#xe648;</text>
      </navigator>
    </view>
  </view>
</template>

<script setup lang='ts'>
  import { ref, reactive, onMounted, onUnmounted } from "vue";
  let toolList = reactive < { label: string, value: string } [] > ([
    { label: '百度', value: 'https://www.baidu.com/s?wd=' },
    { label: 'bing', value: 'https://cn.bing.com/search?q=' },
  ])
  let searchWord = ref < string | undefined | null > ('')
  let index = ref < number > (0)
</script>

<style scoped lang='scss'>
  .container {
    width: 100%;

    .search-box {
      height: var(--height);
      margin: 0 auto;
      border-radius: var(--height);
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr auto calc(var(--height) * 1.3);
      background-color: var(--color-white);

      .search {
        grid-column: 1;
        height: 100%;
        width: 100%;
        padding-left: 1em;
        box-sizing: border-box;
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
