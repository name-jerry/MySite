<script lang="ts">
  export default {
    onLaunch: function() {
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
    },
    onShow: function() {
      console.log("App Show");
    },
    onHide: function() {
      console.log("App Hide");
    },
  };
</script>

<style>
  page {
    /* uniapp的html的font-size会随着设备以及宽度的变化而变化,这里设置没用 */
    /* font-size: 10px; */
    --color-white: rgba(255, 255, 255, 1);
    --color-white-1: rgba(255, 255, 255, .4);
    --color-white-2: rgba(255, 255, 255, .6);
    --color-shadow-1: rgba(0, 0, 0, .15);
    --color-shadow-2: rgba(0, 0, 0, .2);
    --color-bg: hsl(0, 0%, 97%);
    --color-text-1: hsl(0, 0%, 0%);
    --color-1: hsl(199, 50%, 54%);
    --color-2: hsl(199, 30%, 40%);
    --color-3: hsl(199, 70%, 84%);
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
    --gradient-light: linear-gradient(135deg, hsl(0, 0, 100%), hsl(0, 0, 80%));
    --gradient-1: linear-gradient(90deg,
        var(--color-1),
        var(--color-2) 51%);
    --gradient-2: linear-gradient(90deg,
        var(--color-1),
        var(--color-3) 51%,
        var(--color-1));
    --fontSize-1: 1.5em;
    --fontSize-2: 1.4em;
    --fontSize-3: 1.3em;
    --fontSize-4: 1.2em;
    --fontSize-5: 0.8em;
    --lineHeight-1: 1.5;
    --lineHeight-2: 2;
    --radius-4: 4px;
    --radius-6: 6px;
    --radius-8: 8px;
    --radius-16: 16px;
    --radius-48: 48px;
    --transition-1: 0.25s ease;
    --transition-2: 0.5s ease;
    --cubic-in: cubic-bezier(0.51, 0.03, 0.64, 0.28);
    --cubic-out: cubic-bezier(0.05, 0.83, 0.52, 0.97);
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
    src: url('//at.alicdn.com/t/c/font_3837728_brhs46ql054.woff2?t=1676335857174') format('woff2'),
      url('//at.alicdn.com/t/c/font_3837728_brhs46ql054.woff?t=1676335857174') format('woff'),
      url('//at.alicdn.com/t/c/font_3837728_brhs46ql054.ttf?t=1676335857174') format('truetype');
  }

  [class*="icon"] {
    font-family: "iconfont" !important;
    display: flex;
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
    height: 100%;
    color: var(--color-text);
    text-shadow: 1px 1px 1px var(--color-white-1);
    font-family: Tahoma, Verdana, sans-serif, kaiti, Times, serif;
    font-size: var(--fontSize-3);
    line-height: var(--lineHeight-1);
    background-color: var(--color-bg);
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

  /* uniapp格式化button */
  .btn {
    padding: 0;
    font: unset;
    color: unset;
    line-height: var(--lineHeight-1);
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
    transition: var(--transition-1);
  }

  /* ===========交互=============== */
  .logo {
    aspect-ratio: 1190 / 340;
    transition: var(--transition-1);
    cursor: pointer;
  }

  .logo:hover {
    filter: brightness(1.2);
  }

  .hover-color,
  .hover-bg-color,
  .hover-bg-move,
  .hover-shadow-btn {
    transition: var(--transition-1);
    cursor: pointer;
  }

  .hover-shadow-btn,
  .hover-shadow-input {
    transition: var(--transition-1);
  }

  .hover-shadow-btn {
    box-shadow: var(--shadow-btn);
  }

  .hover-shadow-input {
    box-shadow: var(--shadow-input);
  }

  .hover-bg-move {
    background-size: 200%;
    background-position: left;
  }

  /* 字体变色 */
  .hover-color:hover {
    color: var(--color-2)
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
  .btn-primary {
    padding: 8px 16px;
    border-radius: 6px;
  }

  .btn-secondary {
    padding: 18px 30px;
    border-radius: 11px;
  }

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
    /* 设置100%未达到最大宽度时显示沾满 */
    max-width: 80%;
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
      max-width: 720px;
    }
  }

  @media (max-width: 768px) {
    :root {
      /* font size */
      --fontSize-1: 4.4rem;
    }

    .container {
      max-width: 540px;
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
      max-width: 100%;
    }
  }
</style>
