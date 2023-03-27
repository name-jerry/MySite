<script setup lang="ts">
  import { reactive, onMounted, watch } from "vue";
  import { onLoad } from '@dcloudio/uni-app';
  import type { Option } from '@/type';
  import useMainStore from "@/stores/useMainStore"
  let main = useMainStore();
  // 登录判断
  // 跳转时带的参数
  type Query = {
    needLogin ?: Boolean
    uniIdRedirectUrl ?: String
  }
  let query : Query;

  // 插入模块
  let show = reactive({
    myMemo: { value: true, lable: "计划表" },
    filePicker: { value: false, lable: "上传文章" },
    login: { value: false, lable: "登录" },
    swipe: { value: true, lable: "轮播图" },
    set: { value: false, lable: "设置" },
  })
  // 设置
  let setOptions = reactive<Option[]>([])
  function initSet() {
    for (let [k, v] of Object.entries(show)) {
      if (k == 'set') continue;
      setOptions.push({ key: k, title: v.lable })
    }
    setOptions.push({ key: '', title: "退出" })
  }

  function setSelect(option : Option) : void {
    show.set.value = false;
    let k = option.key
    if (!k) {
      main.isLogin = false;
    } else {
      show[k].value = true;
    }
  }

  // 需要登录时
  onLoad((q) => {
    q as Query;
    if (q!.needLogin) {
      query = q!;
      show.login.value = true
    }
  })

  // =========挂载卸载============
  onMounted(() => {
    initSet()
    // 防刷新
    watch(() => main.isLogin, async () => {
      const l = main.isLogin
      show.login.value = !l;
      if (l && query && query.uniIdRedirectUrl) {
        setTimeout(() => uni.showToast({
          title: '返回之前访问页面',
        }), 1000)
        setTimeout(() => {
          uni.redirectTo({
            url: query.uniIdRedirectUrl
          })
        }, 2000)
      }
    })
  })
</script>
<template>
  <view class="body">
    <!-- 第一区备忘录模块等模块1fr(左右空出放置按钮),第二区放置搜索框,第三区放置快捷方式,第四加个1fr放置备案信息-->
    <view class="module container">
      <MyMemo v-if="show.myMemo.value" class="memo" @need-login='show.login.value=true'>
        <view class="closeBtn" @tap="show.myMemo.value=false"></view>
      </MyMemo>
      <Login class="login" v-show="show.login.value">
        <view class="closeBtn" @tap="show.login.value=false"></view>
      </Login>
      <SwipeView v-show="show.swipe.value" class="swipe-wrap">
        <view class="closeBtn" @tap.stop="show.swipe.value=false"></view>
      </SwipeView>
      <ReadFilePicker v-show="show.filePicker.value" class="file-picker">
        <view class="closeBtn" @tap.stop="show.filePicker.value=false"></view>
      </ReadFilePicker>
    </view>
    <TagsWrap class="tags-wrap"></TagsWrap>

    <!-- 固定信息部分 -->
    <SearchWrap class=' container search-wrap'>
    </SearchWrap>
    <image class="logo" src="@/static/img/logo.svg" />
    <text url="../login/login.vue" class="set hover-color icon" @tap='show.set.value=!show.set.value'>&#xe600;</text>
    <Options v-if="show.set.value" :options='setOptions' :showMask='true' class="set-options"
      @cancel='show.set.value=!show.set.value' @select='setSelect' />
    <MyFooter class="footer container"></MyFooter>
  </view>
</template>


<style lang="scss" scoped>
  .body {
    height: 100vh;
    display: grid;
    grid-template-rows: auto 20px auto 1fr;
    gap: 10px;
    place-items: center;
    font-size: 16px;
    overflow: auto;
    position: relative;
  }

  .closeBtn {
    height: 30px;
    width: 30px;
    position: absolute;
    right: 8px;
    top: 8px;
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

  .module {
    grid-row: 1;
    align-self: end;
    padding-top: 80px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
  }

  .memo,
  .file-picker,
  .swipe-wrap {
    --color-white-1: hsl(207, 45%, 82%);
    --color-white-2: hsl(207, 45%, 85%);
    --color-shadow-1: #7496ab;
    --color-shadow-2: #a7c6dc;
    border-radius: 12px;
    background-color: var(--color-bg-quote);
    box-shadow: -1px -1px 2px var(--color-white-1),
      inset 1px 1px 1px var(--color-white-2),
      2px 2px 4px var(--color-shadow-1),
      inset -1px -1px 1px var(--color-shadow-2);
  }



  .memo,
  .file-picker,
  .swipe-wrap {
    height: 300px;
    max-height: 300px;
  }

  .login {
    height: 300px;
  }

  .tags-wrap {
    grid-row: 3;
    z-index: 3;
  }



  .footer {
    grid-row: -2;
    color: gray;
    place-self: end start;
  }

  // 固定组件
  .logo,
  .set,
  .set-options,
  .search-wrap {
    top: 20px;
    transition: var(--transition-1);
    position: absolute;
  }

  .logo,
  .set {
    height: 30px;
  }

  .logo {
    object-fit: cover;
    width: auto;
    left: 30px;
  }

  .search-wrap {
    width: 50%;
    box-sizing: border-box;
    padding: 0;
    left: 50%;
    transform: translateX(-45%);
    z-index: 2;
  }

  .set {
    right: 30px;
    margin-right: 10px;
    font-size: var(--fontSize-default);

    &:active {
      transform: scale(.9);
    }
  }

  .set-options {
    right: 60px;
    font-size: 14px;
    background-color: white;
    z-index: 9;

  }

  @media (width<=575px) {
    .set-options {
      position: fixed;
      width: 100vw;
      top: 0;
      right: 0;
      background-color: white;

      &:deep(.mask) {
        background-color: rgba(0, 0, 0, .3);
      }
    }
  }
</style>