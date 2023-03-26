<template>
  <view class="container">
    <ShowMD :mdText='mdText' :showMd="showMd" @update='update'>
      <template #default>
        <SearchWrap class='search-wrap' :auto-shrink='true'></SearchWrap>
      </template>
      <template #header>
        <view class="btns">
          <navigator class="back" open-type='redirect' url="/pages/Home/Home">首页</navigator>
          <button class="updateBtn" @tap="showMd=!showMd">{{showMd?'预览':'编辑'}}</button>
          <button class="saveBtn " @tap="save">保存</button>
          <button class="recoverBtn " @tap="recover" v-show="showSave&&!showMd">恢复</button>

          <picker v-if='main.artList[0]' class="pickerBtn" mode="selector" :range="main.artList" range-key="title"
            :value='artIndex' @change="artIndex=$event.detail.value">
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
  let main = useMainStore();
  // 当前文章下标数据的key
  const currenteIndexKey = 'articleIndex';
  let curdArt = getCurd<Article>('articles');
  let mdText = ref<string>('');
  let query : { title : string };
  let artIndex = ref<number>(0);
  let currentArt = computed<Article>(() => main.artList[artIndex.value]);
  let showMd = ref<Boolean>(false);
  let showSave = ref<Boolean>(false);
  function update(text : string) {
    mdText.value = text;
    showSave.value = true;
  };

  onLoad((q) => {
    query = q as { title : string }
  });
  onMounted(() => {
    initArtIndex()
    watch(artIndex, () => {
      uni.setStorageSync(currenteIndexKey, '' + artIndex.value);
      updateMdTextByIndex();
    }, { immediate: true })
  })
  async function save() {
    let a = currentArt.value
    a.content = mdText.value;
    if (main.isOnLine) {
      curdArt("update", a)
    } else {
      // 获取文件内容，例如从服务器获取
      // 这里假设你已经在一个字符串变量中获得了文件内容
      var fileContent = a.content;
      // 将字符串转换成 Blob 对象
      var blob = new Blob([fileContent], { type: "text/plain" });
      // 创建 URL 字符串
      var url = URL.createObjectURL(blob);
      // 创建 a 标签，设置 href 和 download 属性
      var link = document.createElement("a");
      link.href = url;
      link.download = a.title;
      // 将 a 标签添加到文档中并触发下载
      document.body.appendChild(link);
      link.click();
      // 清理临时 URL 对象
      URL.revokeObjectURL(url);
      link.remove()
    }
    showSave.value = false
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
    artIndex.value = i
  }

  async function updateMdTextByIndex() {
    let { title, content } = main.artList[artIndex.value]
    let a = history.state.current.toString().replace(/=.+$/, '=' + title)
    history.replaceState(history.state, null, a);
    mdText.value = content
  }
  async function print() {
    window.print();
  }
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
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