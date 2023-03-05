<template>
  <view class="container">
    <ShowMD :mdText='mdText'></ShowMD>
    <picker v-if='mdList[0]' class="picker" mode="selector" :range="mdList" range-key="title" :value='index'
      @change="mdChange">
      {{mdList[index].title}}
    </picker>
    <uni-file-picker class="file-picker" v-model="test" fileMediatype="all" mode="grid" @select="fileSelect"
      @progress="progress" @success="success" @fail="fail" />
    <navigator class="back" url="/pages/Home/Home">首页</navigator>
  </view>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    reactive,
    watch,
    onUnmounted,
    WatchStopHandle,
    onBeforeMount
  } from "vue";
  import getMds from '@/tools/getMds';
  import { onLoad } from '@dcloudio/uni-app'

  type mdItem = {
    title : string
  }
  // 当前文章下标数据的key
  const currenteIndexKey : 'articleIndex' = 'articleIndex'
  let mdText = ref<string>('')
  let mdList = reactive<mdItem[]>([]);
  let query : { value : string };
  type MdNames = string[];
  async function getMdNames() : Promise<MdNames> {
    let names : MdNames = await getMds();
    names.map((item : string) => {
      mdList.push({ title: item.replace('.md', '') })
    })
    return names
  }
  let index = ref<number>(0)
  let stop : WatchStopHandle;
  // 选择文章
  function mdChange(e : CustomEvent) {
    let i : number = e.detail.value;
    getMdText(i);
  }
  async function getMdText(i : number) {
    index.value = i
    let title = mdList[i].title
    let a = history.state.current.toString().replace(/=.+$/, '=' + title + '.md')
    history.replaceState(history.state, null, a);
    let res = await (uni.request({ url: './mds/' + title + '.md' }) as unknown as Promise<{ data : string }>)
    mdText.value = res.data
  }
  // 上传文章
  let test = ref()
  // watchEffect(() => { console.log(test.value) })

  function fileSelect(e) { console.log(e); }

  function progress(e) { console.log(e.progress); }

  function success(e) { console.log('success', e.tempFilePaths); }

  function fail() { console.log('fail'); }
  onLoad(q => {
    query = q as { value : string }
  })
  onMounted(() => {
    getMdNames().then((names) => {
      let i : number = -1;
      if (query && query.value) i = names.indexOf(query.value);
      if (~i) {
        uni.setStorageSync(currenteIndexKey, '' + i);
        index.value = i
      } else {
        index.value = +uni.getStorageSync(currenteIndexKey)
      }
      getMdText(index.value)
    })
    stop = watch(index, () => {
      uni.setStorageSync(currenteIndexKey, '' + index.value);
    })
  })
  onUnmounted(() => {
    (typeof stop === 'function') && stop();

  })
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    position: relative;
  }

  .picker {
    position: absolute;
    background-color: var(--color-3);
    right: 24px;
    top: 8px;
    border-radius: 12px;
    padding: 4px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .file-picker {
    position: absolute;
    background-color: var(--color-3);
    left: 50%;
    top: 8px;
    width: fit-content !important;
    box-sizing: border-box;
    transform: translateX(-50%);
  }

  .back {
    position: absolute;
    left: 100px;
    top: 8px;
  }
</style>
