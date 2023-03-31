<template>
  <div class="picker-wrap" @dragenter.prevent @dragover.prevent @drop.prevent="handleFiles($event.dataTransfer.files)">
    <!-- 主体 -->
    <div class="top"><text class="title">文件列表</text><text class="sub">已选:{{files.length}}</text></div>
    <!-- 显示选择的文件列表 -->
    <div class="list-wrap" @click='remove' :title="files.length>0?'':'支持拖拽'">
      <template v-for="item ,i in files" :key="item.file.name">
        <div class="item">
          <div class="title">{{(item as Item).file.name}}</div>
          <div class="closeBtn" :data-index="i"></div>
          <div class="progress" :style="{width:(item as Item).progress+'%'}"></div>
        </div>
      </template>
    </div>
    <view class="btns">
      <!-- 链接input[type="file"] -->
      <component is='label' for="input" class="btn hover-shadow-btn">选择文件
      </component>
      <button @click='upload' class="btn hover-shadow-btn">开始上传</button>
    </view>
    <!-- input[type="file"]本体掩藏,通过label标签连接 -->
    <component is='input' id='input' type="file" multiple
      @change="handleFiles(($event.target as HTMLInputElement).files)" v-show="false">
    </component>
    <!-- 提供一个默认接口 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { getCurd } from "@/utils/getCurd"
  import { Article } from "@/type";
  import useMainStore from "@/stores/useMainStore";
  let main = useMainStore();
  let curdArt = getCurd<Article>('articles')
  type Item = { progress : number, file : File }
  let files = ref<Item[]>([])
  function handleFiles(fs : FileList) {
    let res = [];
    for (var i = 0; i < fs.length; i++) {
      var file = fs[i];
      if (!/\.md$/g.test(file.name)) {
        uni.showToast({
          title: '只接受md格式',
          icon: 'error'
        })
        continue
      };
      let isContinue : boolean;
      main.artList.forEach(
        (a : Article) => {
          if (a.title == file.name) {
            isContinue = true;
            uni.showToast({
              title: `同名文件不可上传`,
              icon: 'error'
            })
          };
        })
      if (isContinue) continue;
      let item = { progress: 0, file }
      res.push(item)
    }
    files.value = res
  }
  function upload() {
    let fl = files.value.length;
    let ml = main.artList.length;
    files.value.map((item) => {
      let file = item.file
      const reader = new FileReader();
      reader.onload = async function (e) {
        let a : Article = {
          _id: 'offLine',
          sub: file.name,
          title: file.name,
          content: e.target.result as string
        }
        // 在线是同步到网络
        if (main.isOnline) {
          let res = await curdArt("add", a)
          a._id = res.id;
        }
        main.artList.push(a);
        item.progress = 100;

        if (main.artList.length == fl + ml) {
          uni.showToast({
            title: "上传成功"
          })
          setTimeout(() => files.value = [], 1000)
        }
      }
      reader.readAsText(file);
    })
  }
  function remove(e : Event) {
    let i : number = (e.target as HTMLDivElement)?.dataset?.index
    if (i) files.value.splice(i, 1);
  }
</script>

<style scoped lang="scss">
  .picker-wrap {
    font-size: inherit;
    display: grid;
    grid-template-rows: auto 1fr auto;
    border-radius: inherit;
    height: 100%;
    width: 100%;
    background-color: inherit;
    overflow: hidden;
    position: relative;
    --color-white-1: hsl(207, 45%, 82%);
    --color-white-2: hsl(207, 45%, 85%);
    --color-shadow-1: #7496ab;
    --color-shadow-2: #a7c6dc;



    &>.top {
      position: relative;
      margin: 4px 0;
      display: grid;
      place-items: center;
      font-size: var(--fontSize-3);

      .sub {
        position: absolute;
        right: 40px;
        bottom: 0px;
        font-size: .6em;
      }
    }
  }

  .list-wrap {
    background-color: var(--color-bg-default);
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    /* y对应width,x对应height */
    &::-webkit-scrollbar {
      width: 10px;
    }

    /* 轨道 */
    &::-webkit-scrollbar-track {
      box-shadow: var(--shadow-input-focus);
    }

    /* 滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      border: 1px solid var(--color-border-default);
      background-color: var(--color-1);
    }

    &::before {
      content: attr(title);
      position: absolute;
      inset: 0;
      color: white;
      text-shadow: 1px 1px gray;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2em;
    }

    .item {
      box-shadow: var(--shadow-btn-hover);
      background-color: inherit;
      flex: none;
      padding: 8px;
      box-sizing: border-box;
      padding-left: 16px;
      border-radius: 6px;
      position: relative;

      .progress {
        position: absolute;
        left: 0px;
        bottom: 0;
        height: 2px;
        background-color: gray;
        box-shadow: 0px 0px 4px 1px hsl(146, 36%, 61%);
        background-image: repeating-linear-gradient(45deg, hsl(146, 36%, 61%) 0, hsl(146, 36%, 61%) 10px, #3A4856 10px, #3A4856 20px);
        background-position: 0 0;
        background-size: 100% 100px;
        animation: move 1s linear infinite;

        @keyframes move {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 0 -58px;
          }
        }

      }
    }

  }

  .btns {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, 1fr);
    overflow: hidden;
    padding: 8px;
    background-color: inherit;


    &>.btn {
      margin: 0;
      border-radius: 6px;
      background-color: var(--color-3);
      box-shadow: -1px -1px 2px hsl(199, 69%, 100%),
        2px 2px 4px hsl(199, 60%, 60%);

      &:active {
        box-shadow: inset 2px 2px 4px hsl(199, 60%, 60%),
          inset -1px -1px 1px hsl(199, 69%, 100%);
      }
    }

  }

  .closeBtn {
    height: 30px;
    width: 30px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      width: 2px;
      height: 60%;
      background: var(--color-4);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
</style>