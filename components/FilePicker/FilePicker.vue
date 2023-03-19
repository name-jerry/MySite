<template>
  <view class="file-picker">
    <uni-file-picker ref="artPicker" class="art-picker" fileMediatype="all" :auto-upload="false" file-extname='md'
      :title="fileTitle" @success="success" @fail="fail">
      <view class="artbtns">
        <button class="btn1 hover-shadow-btn">选择文件</button>
        <button @tap.stop="artPicker.upload()" class="btn2 hover-shadow-btn">上传文件</button>
      </view>
    </uni-file-picker>
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import { Article } from "@/type"
  import { getCurd } from "@/utils/getCurd"
  import useMainStore from "@/stores/useMainStore";
  let main = useMainStore();
  let curdArt = getCurd<Article>('articles');
  let fileTitle = ref<string>("已选择:")
  let artPicker = ref()
  function success(e) {
    uni.showToast({
      title: "上传成功"
    })
    e.tempFiles.map((a) => {
      let { name, url, fileID } = a
      let addA = { title: name, file: { name, fileID, url } }
      curdArt("add", addA)
      main.artList.push(addA)
    })
    artPicker.value.clearFiles();
  }
  function fail(e) { console.log('fail', e); }
</script>

<style scoped lang="scss">
  .file-picker {
    position: relative;
  }

  .art-picker {
    width: fit-content;
    margin: 0 auto;

    .artbtns {
      display: flex;
      gap: 24px;

      .btn1 {
        background-color: var(--color-3);
      }

      .btn2 {
        background-color: hsl(146, 36%, 61%);
      }
    }
  }
</style>
