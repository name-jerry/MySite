<script lang="ts" setup>
  import { onLaunch, onShow } from '@dcloudio/uni-app';
  import { checkLogin } from "@/utils/checkLogin"
  import useMainStore from "@/stores/useMainStore"
  import { useRefresh } from "@/utils/useRefresh"
  import { getCurd } from "@/utils/getCurd"
  import type { Article } from "@/type"
  // 当前文章下标数据的key
  // 不受main.isOnLine影响,获取在线数据并赋值main.artList
  const articleKey = "articleKey";
  let curdArt = getCurd<Article>('articles', true);
  let { list } = useRefresh<Article>(curdArt, articleKey);
  let main = useMainStore();
  main.artList = list

  onLaunch(() => {
    console.log("App onLaunch");
    // #ifndef H5 || APP-PLUS
    let updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) console.log("有新版本");
    });
    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) updateManager.applyUpdate();
        },
      });
    });
    // #endif
  })
  onShow(() => {
    let main = useMainStore()
    console.log("App Show");
    // 注册登录事件
    uniCloud.onNeedLogin(event => {
      let isLogin = checkLogin()
      if (!isLogin) {
        main.isLogin = false
        uni.navigateTo({
          url: "/pages/Home/Home?needLogin=true&uniIdRedirectUrl=" + event.uniIdRedirectUrl
        })
        uni.showToast({
          title: "请登录",
          icon: "none"
        })
      }
    })
  })
</script>

<style lang="scss">
  page {
    /* uniapp的html的font-size会随着设备以及宽度的变化而变化,这里设置没用 */
    /* font-size: 10px; */
    --color-white-1: rgba(255, 255, 255, .4);
    --color-white-2: rgba(255, 255, 255, .7);
    --color-shadow-1: rgba(0, 0, 0, .15);
    --color-shadow-2: rgba(0, 0, 0, .2);
    --color-1: hsl(207, 45%, 65%);
    --color-2: hsl(206, 100%, 42%);
    --color-3: hsl(207, 45%, 80%);
    --color-4: #3A4856;
    --color-5: hsl(146, 36%, 61%);
    --color-border-default: hsl(207, 30%, 80%);
    --color-a-default: var(--color-2);
    --color-font-default: var(--color-4);
    --color-font-title: var(--color-font-default);
    --color-bg-default: hsl(0 0% 97%);
    --color-bg-btn: var(--color-2);
    --color-bg-quote: var(--color-3);
    --color-bg-code: var(--color-3);
    --color-bg-pre: var(--color-3);
    --borderRadius-default: 6px;
    --padding-default: calc(var(--fontSize-default) / 2);
    --lineHeight-default: 1.5;
    --transition-default: 0.25s ease;
    --fontSize-default: 16px;
    --fontSize-1: calc(var(--fontSize-default) * 2);
    --fontSize-2: calc(var(--fontSize-default) * 1.5);
    --fontSize-3: calc(var(--fontSize-default) * 1.25);
    --shadow-btn: -4px -4px 8px var(--color-white-1),
      inset 1px 1px 1px var(--color-white-2),
      6px 6px 12px -2px var(--color-shadow-1),
      inset -1px -1px 1px var(--color-shadow-2);
    --shadow-btn-hover: -1px -1px 2px var(--color-white-1),
      inset 1px 1px 1px var(--color-white-2),
      2px 2px 4px var(--color-shadow-1),
      inset -1px -1px 1px var(--color-shadow-2);
    --shadow-btn-active: -1px -1px 0px var(--color-shadow-1),
      inset 4px 4px 8px -4px var(--color-shadow-2),
      1px 1px 0px var(--color-white-2),
      inset -1px -1px 2px var(--color-white-1);
    --shadow-input: -1px -1px 0px var(--color-shadow-1),
      inset 4px 4px 2px var(--color-shadow-2),
      1px 1px 0px var(--color-white-2),
      inset -3px -3px 6px var(--color-white-1);
    --shadow-input-focus: -1px -1px 0px var(--color-shadow-1),
      inset 4px 4px 2px -2px var(--color-shadow-2),
      1px 1px 0px var(--color-white-2),
      inset -1px -1px 2px var(--color-white-1);
    --gradient-light: linear-gradient(135deg, hsla(0, 0%, 100%, .3), hsla(0, 0%, 100%, .2));
    --gradient-1: linear-gradient(90deg,
        var(--color-1),
        var(--color-2) 51%);
    --gradient-2: linear-gradient(90deg,
        var(--color-1),
        var(--color-3) 51%,
        var(--color-1));
    --gradient-3: linear-gradient(180deg,
        var(--color-1),
        var(--color-3) 51%,
        var(--color-1));
  }


  /*  @media (max-width: 1200px){}

@media (max-width: 992px) {}

@media (max-width: 768px) {}

@media (max-width: 575px) {} */

  /*每个页面公共css */

  /* ======================fontIcon============================= */
  /* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
  @font-face {
    font-family: 'iconfont';
    /* Project id 3837728 */
    src: url('/static/font/iconfont.ttf');
  }


  @font-face {
    font-family: 'Fira Code';
    src: url('/static/font/FiraCode.woff2') format('woff2'),
      url("/static/font/FiraCode.woff") format("woff");
  }

  [class*="icon"] {
    font-family: "iconfont" !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    width: 1em;
    height: 1em;
    text-indent: 0;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ============父组件============== */
  page {
    min-height: calc(100vh - var(--window-top));
    /* 兼容 苹果手机 */
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    color: var(--color-font-default);
    font-family: Tahoma, Verdana, sans-serif, kaiti, Times, serif;
    font-size: var(--fontSize-default);
    line-height: var(--lineHeight-default);
    background-color: var(--color-bg-default);
  }

  #app {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    font-weight: normal;
  }

  /* =======================格式化标签 ======================= */
  img,
  a,
  span,
  button {
    display: inline-block;
    color: inherit;
    font: inherit;
  }

  button {
    /* 改变下指针的样式 改成手指*/
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 0;
  }

  /*  =================标题============== */
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6 {
    display: block;
    font-weight: 700;
    line-height: 1.25;
    margin: var(--fontSize-2) 0 var(--fontSize-default);
    color: var(--color-font-title);
  }

  .h1,
  .h2 {
    border-bottom: 1px solid hsla(210, 18%, 87%, 1);
    padding-bottom: .25em;
  }

  .h1 {
    font-size: var(--fontSize-1);
    font-weight: 800;
  }

  .h2 {
    font-size: var(--fontSize-2);
    padding-left: .25em;
    border-left: .25em solid var(--color-border-default);
  }

  .h3 {
    font-size: var(--fontSize-3);
  }

  .h4 {
    text-transform: uppercase;
  }

  .h5 {
    text-transform: uppercase;
  }

  .h6 {
    color: #AAA;
  }

  /* uniapp格式化button */
  .btn {
    padding: 0;
    font: unset;
    color: unset;
    line-height: var(--lineHeight-default);
    border: none;
    border-radius: initial;
    background-color: unset;
    outline: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .btn::after {
    content: none;
  }

  button:hover {
    outline: none;
  }

  a,
  label,
  input[type="radio"] {
    cursor: pointer;
    text-decoration: none;
    transition: var(--transition-default);
  }

  /* ===========交互=============== */
  .logo {
    aspect-ratio: 1190 / 340;
    transition: var(--transition-default);
    cursor: pointer;
  }

  .logo:hover {
    filter: brightness(1.1);
  }

  .hover-color,
  .hover-bg-color,
  .hover-bg-move,
  .hover-shadow-btn {
    transition: var(--transition-default);
    cursor: pointer;
  }

  .hover-shadow-btn {
    box-shadow: var(--shadow-btn);
  }

  .hover-shadow-input {
    transition: var(--transition-default);
    box-shadow: var(--shadow-input);
  }

  .hover-bg-color {
    padding: .2em .5em;
  }

  .hover-bg-move {
    background-size: 200%;
    background-position: left;
  }

  /* 字体变色 */
  .hover-color:hover {
    filter: brightness(.9);
  }

  /* 背景变色 */
  .hover-bg-color:hover {
    background-color: hsla(0, 0%, 0%, 0.2) !important;
  }

  /* 背景移动 */
  .hover-bg-move:hover {
    background-position: right;
  }

  .hover-shadow-input:focus-within {
    box-shadow: var(--shadow-input-focus);
  }

  .hover-shadow-btn:hover {
    box-shadow: var(--shadow-btn-hover);
  }

  .hover-shadow-btn:active {
    box-shadow: var(--shadow-btn-active);
  }

  /* ===================常用的样式============================ */
  .flex1 {
    flex: 1;
  }

  .rotate {
    transform: rotate(var(--rotate));
  }

  .lines {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--lines);
    overflow: hidden;
  }

  /* ====================响应式调整===================== */
  /* 每个块都设置container类为了在统一调整显示 */
  .container {
    max-width: 1140px;
    box-sizing: border-box;
    width: 100%;
    /* 设置块元素的左右居中 */
    margin: 0 auto;
    /* 设置当宽度压缩的时候保证内容和边界仍有空间 */
    padding-right: 16px;
    padding-left: 16px;
  }

  @media (max-width: 1200px) {
    .container {
      max-width: 930px;
    }
  }

  /* header变化 */
  @media (max-width: 992px) {
    .container {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    :root {
      /* font size */
      --fontSize-1: 4.4rem;
    }


  }

  @media (max-width: 575px) {
    :root {
      --fontSize-1: 2.9rem;
      --fontSize-2: 2rem;
    }

    .container {
      padding-left: 10px;
      padding-right: 10px;

    }
  }
</style>