<template>
  <view class="container">
    <ShowMD :mdText='mdText' :showMd="showMd" @update='update'
      :class="{'show-save':showSave,'show-download':showDownload}">
      <template #default>
        <SearchWrap class='search-wrap' :auto-shrink='true'></SearchWrap>
      </template>
      <template #header>
        <view class="btns">
          <navigator class="back" open-type='redirect' url="/pages/Home/Home">首页</navigator>
          <button class="updateBtn" @tap="switchView">{{showMd?'预览':'编辑'}}</button>
          <button class="saveBtn " @tap="save"
            v-show="showSave||showDownload">{{showSave?'保存':showDownload?'下载':'保存'}}</button>
          <button class="recoverBtn " @tap="recover" v-show="showSave&&!showMd">恢复</button>

          <picker v-if='main.artList[0]' class="pickerBtn" mode="selector" :range="main.artList" range-key="title"
            :value='currentArtIndex' @change="currentArtIndex=$event.detail.value">
            {{"文章:"+currentArt.title}}
          </picker>
          <button class="printBtn" @tap='print'>打印</button>
        </view>
      </template>
    </ShowMD>
  </view>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed, } from "vue";
  import { onLoad } from '@dcloudio/uni-app';
  import { getCurd } from "@/utils/getCurd";
  import { Article } from "@/type";
  import useMainStore from "@/stores/useMainStore";
  import { downloadArt } from "@/tools/dowloadArt"
  import { useEventListener } from "@/utils/event"
  let main = useMainStore();
  // 当前文章下标数据的key
  const currenteIndexKey = 'articleIndex';
  let curdArt = getCurd<Article>('articles');
  let mdText = ref<string>('');
  let query : { title : string };
  let currentArtIndex = ref<number>(0);
  let currentArt = computed<Article>(() => main.artList[currentArtIndex.value]);
  /**切换视图*/
  let showMd = ref<Boolean>(false);
  let showSave = ref<Boolean>(false);
  let showDownload = computed<boolean>(() => main.artList[currentArtIndex.value].updateCount);
  let keydownFns = new Map()
  keydownFns.set('KeyA', switchView)
  keydownFns.set('KeyS', () => showSave.value && save())
  keydownFns.set('KeyD', () => {
    if (showSave.value) {
      save(); save();
    } else { save(); }
  })
  function keydown(e : KeyboardEvent) {
    let k = e.code;
    if (!e.ctrlKey || !keydownFns.has(k)) return;
    e.preventDefault();
    keydownFns.get(k)();
  }
  useEventListener(window, 'keydown', keydown)
  function update(text : string) {
    mdText.value = text;
    showSave.value = true;
  };
  onLoad((q) => {
    query = q as { title : string }
  });
  onMounted(() => {
    initArtIndex()
    watch(currentArtIndex, () => {
      uni.setStorageSync(currenteIndexKey, '' + currentArtIndex.value);
      updateMdTextByIndex();
    }, { immediate: true })
  })
  function switchView() {
    showMd.value = !showMd.value
  }
  async function save() {
    let a = currentArt.value
    a.content = mdText.value;
    if (main.isOnLine) {
      curdArt("update", a)
      showSave.value = false
    } else {
      if (showSave.value) {
        main.artList[currentArtIndex.value].content = a.content
        showSave.value = false
        main.artList[currentArtIndex.value].updateCount = true
        return
      }

      downloadArt(a)
    }
    main.artList[currentArtIndex.value].updateCount = false

  }

  function recover() {
    uni.showModal({
      title: '提示',
      content: '是否恢复改动',
      confirmText: '恢复',
      cancelText: '不恢复',
      success(e) {
        if (!e.confirm) return;
        mdText.value = currentArt.value.content;
        showSave.value = false;
      }
    })
  }
  function initArtIndex() {
    let i : number = -1;
    // 跳转时
    if (query && query.title) i = main.artList.findIndex((a : Article) => a.title == query.title);
    // 跳转无参数时
    if (!~i) i = +uni.getStorageSync(currenteIndexKey);
    // 本地无存储时
    if (!~i) i = 0;
    // 触发watch
    currentArtIndex.value = i
  }

  async function updateMdTextByIndex() {
    let { title, content } = main.artList[currentArtIndex.value]
    let a = history.state.current.toString().replace(/=.+$/, '=' + title)
    history.replaceState(history.state, null, a);
    mdText.value = content
  }
  function print() {
    window.print();
  }
</script>

<style lang="scss" scoped>
  .container {
    display: flex;


  }



  .show-download {
    box-shadow: 0px 0px 10px yellow;
  }

  .show-save {
    box-shadow: 0px 0px 10px red;
  }

  .btns {
    display: flex;
    width: 100%;
    padding-left: 8px;
    gap: 8px;

    &>:not(.search-wrap) {
      background-color: var(--color-3);
      border-radius: 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      white-space: nowrap;
      height: 32px;
      font-size: 16px;
      font-weight: 800;
      text-shadow: 1px 1px 1px hsl(0, 0%, 97%);
      color: var(--color-font-default);
      padding: 4px 16px;
      box-shadow: var(--shadow-btn);
      margin: 0;

      &:hover {
        box-shadow: var(--shadow-btn-hover);
      }

      &:active {
        box-shadow: var(--shadow-btn-active);
      }
    }
  }

  .search-wrap {
    background-color: white;
    position: fixed;
    right: 20px;
    top: 50%;
    z-index: 2;
  }



  .pickerBtn:not(.a) {
    margin-left: auto;
  }

  .recoverBtn {
    margin-right: auto;
  }

  @media print {
    .container>*:not(.markdown-box) {
      display: none;
    }

    .container {
      max-width: 100%;
    }
  }
</style>