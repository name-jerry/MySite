<script setup lang="ts">
  import { reactive, onMounted, watch, watchEffect, ref } from "vue";
  import { onLoad } from '@dcloudio/uni-app';
  import type { Option } from '@/type';
  import useMainStore from "@/stores/useMainStore"
  let main = useMainStore();
  const moduleShowKey = 'moduleShowKey'
  // 登录判断
  // 跳转时带的参数
  type Query = {
    needLogin ?: Boolean
    uniIdRedirectUrl ?: String
  }
  let query : Query;
  // 插入模块
  let show = ref<{ [key : string] : { value : boolean, lable : string } }>({
    myMemo: { value: true, lable: "计划表" },
    filePicker: { value: true, lable: "上传文章" },
    login: { value: false, lable: "登录" },
    swipe: { value: false, lable: "轮播图" },
    set: { value: false, lable: "设置" },
  })
  function initShowByStorage() {
    // 登录状态时
    let l = uni.getStorageSync(moduleShowKey);
    // 本地有值时
    if (l?.set) return show.value = l;
  }
  // 设置
  let setOptions = reactive<Option[]>([])
  function swith() {
    uni.showModal({
      title: '提示',
      content: '读写资源有限,暂不开放读写功能'
    })
  }
  function initSet() {
    for (let [k, v] of Object.entries(show.value)) {
      if (k == 'set') continue;
      setOptions.push({ key: k, title: v.lable })
    }
    setOptions.push({ key: '', title: "退出" })
  }

  function setSelect(option : Option) : void {
    show.value.set.value = false;
    let k = option.key
    if (!k) {
      main.isLogin = false;
      uni.clearStorageSync()
    } else if (!main.isLogin && k != 'login') {
      uni.showToast({
        title: '请先登录',
        icon: 'error'
      });
      show.value.login.value = true
    } else {
      show.value[k].value = true;
    }
  }

  // 需要登录时
  onLoad((q) => {
    q as Query;
    if (q!.needLogin) {
      query = q!;
      show.value.login.value = true
    }
  })

  // =========挂载卸载============
  onMounted(() => {
    initShowByStorage()
    initSet()
    watchEffect(() => uni.setStorageSync(moduleShowKey, show.value))
    // 防刷新
    watch(() => main.isLogin, async () => {
      const l = main.isLogin
      show.value.login.value = !l;
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
    <view class="header container">
      <image class="logo" src="@/static/img/logo.svg" />
      <SearchWrap class='search-wrap'>
      </SearchWrap>
      <MySwitch class="swith-online" :checked="main.isOnline" @change="swith" checked-text='在线' unchecked-text='离线'>
      </MySwitch>

      <view url="../login/login.vue" class="set  icon" @tap='show.set.value=!show.set.value'>
        <Options v-if="show.set.value" :options='setOptions' :showMask='true' class="set-options"
          @cancel='show.set.value=!show.set.value' @select='setSelect' /> &#xe600;
      </view>
    </view>

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
    <TagsWrap class="tags-wrap" v-show="main.isLogin"></TagsWrap>
    <MyFooter class="footer container"></MyFooter>
  </view>
</template>


<style lang="scss" scoped>
  .body {
    height: 100vh;
    display: grid;
    grid-template-rows: 80px auto auto 1fr;
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

  .header {
    display: grid;
    grid-template-columns: auto 1fr auto 30px;
    gap: 1vw;
    place-items: center;

    .logo,
    .set,
    .set-options,
    .search-wrap,
    .swith-online {
      transition: var(--transition-1);
    }

    .logo,
    .set {
      height: 30px;
    }

    .logo {
      object-fit: cover;
      width: auto;
    }

    .search-wrap {
      box-sizing: border-box;
      width: 80%;
      max-width: 500px;
      z-index: 4;
    }

    .set {
      font-size: var(--fontSize-default);
      position: relative;
      z-index: 8;
      cursor: pointer;

      &:hover {
        text-shadow: 1px 1px 1px var(--color-5);
      }

      &:active {
        font-size: .90em;
      }
    }


  }

  .set-options {
    position: absolute;
    right: 100%;
    top: 50%;
    font-size: 14px;
    background-color: white;
  }

  .module {
    align-self: end;
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
    z-index: 3;
  }



  .footer {
    grid-row: -2;
    color: gray;
    place-self: end start;
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