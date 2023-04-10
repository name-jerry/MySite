<template>
  <div class="markdown-box" :class="{coexist:isCoexist}">
    <slot> </slot>
    <div class="markdown-head">
      <i class="icon" @tap="tocShow=prop.showMd?tocShow:!tocShow">&#xe677;</i>
      <MySwitch class="switch" :checked='isCoexist' @change='switchCoexist' checked-text='双屏' unchecked-text='单屏'>
      </MySwitch>
      <slot name="header"></slot>
    </div>
    <div ref='markdownBody' class="markdown-body" v-show="!prop.showMd||isCoexist" v-html="mdHtml" @click="clickToc">
    </div>
    <MyTextarea class="textarea" :text="prop.mdText" @update='(t:string)=>$emit("update", t)'
      v-show="prop.showMd||isCoexist">
    </MyTextarea>
    <div class="backTop" :class=' {showBack:showBackTop}' @click="backTop">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd"
          d="M13.792 3.681c-.781-1.406-2.803-1.406-3.584 0l-7.79 14.023c-.76 1.367.228 3.046 1.791 3.046h15.582c1.563 0 2.55-1.68 1.791-3.046l-7.79-14.023Z"
          clip-rule="evenodd"></path>
      </svg>
    </div>
    <Mask v-show='tocShow' class="mask" @tap='tocShow=false'></Mask>
  </div>
</template>

<script setup lang="ts">
  import md from './markdownIt.js'
  import { ref, onMounted, computed, watch, nextTick } from "vue";
  import { useEventListener } from "@/utils/event";

  let prop = defineProps<{ mdText : string, showMd : Boolean }>();
  let emit = defineEmits<{
    (e : 'update', mdText : string) : void,
    (e : 'updateCoexist', isCoexist : boolean) : void
  }>()
  let isCoexist = ref<boolean>(true)
  /**主体的ref对象*/
  let markdownBody = ref()
  /**md文档的html格式*/
  let mdHtml = ref<string>('')
  let tocShow = ref<boolean>(false);
  /**在用于css中v-bind*/
  let tocStyle = computed<'none' | 'inline'>(() => tocShow.value ? 'inline' : 'none');
  let showBackTop = ref<boolean>(false);
  let showBackTopByScrollTop = scrollFn();
  useEventListener(window, 'hashchange', closeToc)
  useEventListener(window, 'scroll', showBackTopByScrollTop)
  onMounted(() => {
    document.documentElement.style.cssText += `scroll-behavior: smooth;scroll-padding-top:50px`;
    watch(() => prop.mdText, init, { immediate: true })
    /**动态设置目录位置 */
    watch(tocShow, () => {
      let tocEl = document.getElementsByClassName('table-of-contents')[0] as HTMLElement;
      tocEl.style.top = (document.getElementsByClassName('markdown-head')[0] as HTMLElement).offsetTop - 10 + 'px';
      document.body.style.overflow = tocShow.value ? 'hidden' : 'auto';
    })
  })
  /**切换按钮时更改变量isCoexist同时抛出事件updateCoexist*/
  function switchCoexist() {
    isCoexist.value = !isCoexist.value;
    emit('updateCoexist', isCoexist.value)
  }
  /**初始化，将prop.mdText转为html并为生成的html内容附加其他属性 */
  async function init() {
    // 手动加目录
    let t = prop.mdText + '\r\n[[toc]]';
    mdHtml.value = md.render(t)
    // 等dom渲染结束,再允许dom操作
    await nextTick();
    preAddCopy();
    updateTargetModule();
  }
  function closeToc() : void {
    if (tocShow) tocShow.value = false;
  }
  function clickToc(e : any) {
    e.target.nodeName == 'A' && closeToc()
  }
  function backTop() {
    window.scrollTo(0, 0);
  }
  /**为滚动设置防抖，距离开头一定距离就显示一个返回开头的按钮*/
  function scrollFn() {
    let setTimeCancel : NodeJS.Timeout | null;
    return function () {
      if (setTimeCancel) clearTimeout(setTimeCancel);
      setTimeCancel = setTimeout(() => {
        var h = document.documentElement.scrollTop || document.body.scrollTop || this.scrollTop;
        showBackTop.value = h > 100 ? true : false;
        setTimeCancel = null
      }, 200)
    }
  }
  /**为代码块增加复制功能*/
  function preAddCopy() {
    let pres = document.querySelectorAll('pre');
    if (!pres.length) return;
    function secondly() {
      if (!document.execCommand) return;
      //  execCommand被废弃的API,部分浏览器支持,作为clipboard不存在时的备选
      let txa = document.createElement('textarea');
      txa.value = this.querySelector('code').innerText;
      document.body.appendChild(txa);
      txa.select();
      let res = document.execCommand('copy');
      document.body.removeChild(txa);
      alert(res ? '复制成功' : '复制失败');
    }
    for (var i = 0; i < pres.length; i++) {
      let pre = pres[i]
      let btn = pre.getElementsByClassName('copyBtn')[0];
      if (!btn) continue;
      btn.setAttribute('value', '复制代码');
      btn.addEventListener('click', function (e) {
        // 剪切版APi不存在时调用老API
        if (!navigator || !navigator.clipboard || !navigator.clipboard.writeText) secondly();

        let text = pre.querySelector('code').innerText;
        navigator.clipboard.writeText(text)
          .then(() => {
            this.setAttribute('value', '复制成功');
            setTimeout(() => {
              this.setAttribute('value', '复制代码')
            }, 3000)

          })
          .catch(() => secondly.call(pre));
      })
    }
  }

  /**变更a标签的打开方式，非页面内跳转都改为在新开页面打开*/
  function updateTargetModule() {
    let h = location.href.toString().slice(0, 10);
    let aList = document.querySelectorAll('a');
    if (!aList.length) return;
    aList.forEach(a => {
      if (!~a.href.toString().indexOf(h)) {
        (a.target = '_blank');
      }
    }
    )
  }
</script>

<style lang="scss" scoped>
  $color-1: hsl(345, 88%, 80%);
  $color-2: hsl(340, 82%, 65%);
  $color-3: hsl(340, 100%, 98%);
  $color-4: #2F4858;
  $color-5: #4F8073;
  $color-border-default: $color-1;
  $color-a-default: $color-2;
  $color-font-default: $color-4;
  $color-font-title: $color-font-default;
  $color-bg-default: white;
  $color-bg-quote: $color-3;
  $color-bg-code: $color-3;
  $color-bg-pre: $color-3;
  $color-bg-hr: $color-5;
  $border-top: 40px;
  $borderRadius-default: 6px;
  $fontSize-default: 16px;
  $fontSize-1: $fontSize-default *2;
  $fontSize-2: $fontSize-default *1.5;
  $fontSize-3: $fontSize-default *1.25;

  @counter-style toc-three {
    system: fixed;
    symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
    suffix: " ";
  }

  // 容器
  .markdown-box {
    border-radius: $borderRadius-default;
    border: 1px #d0d7de solid;
    width: 100%;
    height: 100%;
  }

  .mask {
    z-index: 4;
  }

  //====小组件== 
  .backTop {
    position: fixed;
    right: 20px;
    top: 70%;
    background-color: fade-out($color-1, .7);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $color-2;
    width: 48px;
    height: 48px;
    cursor: pointer;
    transition: .25s ease;
    opacity: 0;

    svg {
      transition: .25s ease;
    }

    &.showBack {
      opacity: 1;
      animation: Q .8s linear;
    }

    &:hover {
      transform: scale(1.1);
      background-color: fade-out($color-1, .5);

      svg {
        transform: scale(1.4);
      }

      &::after {
        transform: translateY(5px);
      }
    }

    &::after {
      content: '回到顶部';
      position: absolute;
      top: 100%;
      font-size: $fontSize-default*.7;
      white-space: nowrap;
      transition: .25s ease;
    }
  }

  @keyframes Q {
    30% {
      transform: scale(0.8, 1.1);
    }

    60% {
      transform: scale(1.1, 0.8);
    }
  }



  // 头部
  .markdown-head {
    position: sticky;
    z-index: 2;
    background-color: white;
    top: 0px;
    left: 0px;
    padding: 8px;
    border-bottom: 1px #d0d7de solid;
    display: flex;
    align-items: center;



    .icon {
      flex: none;
      cursor: pointer;
      font-size: $fontSize-default;
      padding: 8px;
      border-radius: $borderRadius-default;

      &:hover {
        background-color: $color-bg-default;
      }
    }

    .switch {
      color: $color-font-default;
      text-shadow: 1px 1px 1px gray;
    }
  }


  .markdown-body,
  .textarea {
    width: 100%;
    padding: $fontSize-default*2;
    padding-top: $fontSize-default;
    color: $color-font-default;
    font-size: $fontSize-default;
    line-height: 1.5;
    background-color: $color-bg-default;
    background-image: linear-gradient(90deg, rgba(72, 42, 10, .05) 5%, rgba(72, 42, 10, 0) 5%), linear-gradient(1turn, rgba(72, 42, 10, .05) 5%, rgba(72, 42, 10, 0) 0);
    background-size: 20px 20px;
    background-position: 50%;
    position: relative;
    text-shadow: none;
    box-sizing: border-box;
  }

  .textarea {
    font-family: 'Fira Code' !important;
  }

  // 主体
  .markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

    &:deep() {
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        line-height: 1.5;
        user-select: text;
        cursor: auto;
      }

      &>:first-child {
        margin-top: 0;
      }

      &>:last-child {
        margin-bottom: 0;
      }



      // ==========toc===========
      .table-of-contents {
        position: absolute;
        top: 0px;
        left: 40px;
        padding: $fontSize-default;
        padding-left: $fontSize-default*2;
        padding-bottom: 0;
        background-color: $color-bg-default;
        border-radius: $borderRadius-default;
        box-shadow: 0 0 10px gray;
        display: v-bind(tocStyle);
        z-index: 5;

        &>ul {
          list-style: cjk-ideographic;
          color: $color-2;
          font-weight: 800;


          &>li {}

          ul {
            list-style: decimal;
            font-weight: normal;

            ul {
              list-style: toc-three;

            }
          }
        }
      }


      // =================标题==============

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 700;
        line-height: 1.25;
        margin: $fontSize-2 0 $fontSize-default;
        color: $color-font-title;

      }

      h1,
      h2 {
        border-bottom: 1px solid hsla(210, 18%, 87%, 1);
        padding-bottom: .25em;
      }

      h1 {
        font-size: $fontSize-1;
        font-weight: 800;
      }

      h2 {
        font-size: $fontSize-2;
        padding-left: .25em;
        border-left: .25em solid $color-border-default;

        .header-anchor:not(.blank) {
          right: calc(100% + .25em);
        }
      }

      h3 {
        font-size: $fontSize-3;
      }

      h4 {
        text-transform: uppercase;
      }

      h5 {
        text-transform: uppercase;
      }

      h6 {
        color: #AAA;
      }

      // ========段落=========
      p,
      blockquote,
      ul,
      ol,
      dl,
      table,
      pre,
      details,
      .footnotes {
        margin-bottom: $fontSize-default;
      }

      // ===========标题锚点=============
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        position: relative;

        .header-anchor {
          position: absolute;
          line-height: inherit;
          right: 100%;
          text-decoration: none;
          opacity: 0;
          transition: .25s linear;

        }

        &:is(:hover, :focus) {
          a.header-anchor {
            opacity: 1;
            text-decoration: none;
          }
        }
      }


      // ==========a=============
      .table-of-contents a,
      a.header-anchor,
      a.footnote-backref {
        // 重置右上角搜索图标
        background-image: none;
        padding-right: .25em;
        margin-right: initial;
      }

      a>* {
        cursor: pointer;
      }

      a {
        color: $color-a-default;
        padding-left: .25em;
        padding-right: .25em;
        border-radius: $borderRadius-default;
        background-color: darken($color-bg-default, 5%);
        position: relative;
        text-decoration: none;
        transition: .25s ease;
        padding-right: .75em;
        margin-right: .25em;
        background-image: url('./search.svg');
        background-position: right top;
        background-size: .75em;
        background-repeat: no-repeat;
        cursor: pointer;


        &.header-anchor {
          background-color: initial;

          &:hover {
            background-color: darken($color-bg-default, 10%);
          }
        }


        &:not(.header-anchor):hover {
          filter: brightness(95%);
        }



        &:focus {
          outline: none;
          transform: scale(.95);
        }
      }

      :is(a, .footnotes li) {
        filter: hue-rotate(0deg);

        &:target {
          transform: initial;
          filter: hue-rotate(360deg);

          &::after {
            position: absolute;
            inset: 0;
            content: '';
            background-image: linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, .4) 60%, transparent 70%);
            background-size: 300% 100%;
            background-position: 100% 0%;
            background-repeat: no-repeat;
            animation: shine 2s linear forwards;
            pointer-events: none;
          }
        }
      }

      .footnotes li {
        transition: 3s linear;
        background-color: $color-bg-default;

        a {
          background-color: initial;
        }
      }

      @keyframes shine {
        100% {
          background-position: 0% 0;
        }

      }

      // ========列表=========
      :is(dl, ol, ul) {
        padding-left: 2em;

        :is(dl, ol, ul) {
          padding-left: 1em
        }
      }

      ol {
        list-style-type: decimal;

        ol {
          list-style-type: lower-alpha;
        }
      }

      li+li {
        margin-top: .25em;
      }



      // ==========表格===========
      table {
        border-collapse: collapse;
        border-spacing: 0;
        font-size: $fontSize-default;
        font: inherit;


        tr {
          border: 0;
          background-color: #ffffff;

          &:nth-child(2n) {
            background-color: #f3f3f4;
          }
        }

        thead tr {
          background-color: $color-border-default;
        }

        & :is(td, th) {
          border: 1px solid hsla(210, 18%, 87%, 1);
          padding: 8px $fontSize-default;
        }

        th {
          font-weight: 700;
        }
      }

      // ===========pre===========
      pre {
        padding: $fontSize-default;
        overflow: auto;
        font-size: 1em;
        line-height: 1.45;
        background-color: $color-bg-pre;
        border-radius: $borderRadius-default;
        word-wrap: normal;
        position: relative;

        &::before {
          content: attr(lang);
          position: absolute;
          top: 8px;
          right: 70px;
          font-size: 12px;
          color: $color-1;
        }

        .copyBtn {
          position: absolute;
          top: 8px;
          right: 15px;
          font-size: 12px;
          color: $color-1;
          cursor: pointer;

          &::before {
            content: attr(value);
          }

          &:active {
            background-color: $color-1;
          }
        }


        &>code {
          background-color: transparent;
        }
      }

      code {
        font-size: .85em;
        padding-left: 4px;
        padding-right: 4px;
        margin-left: 4px;
        margin-right: 4px;
        white-space: break-spaces;
        background-color: $color-bg-code;
        color: lighten($color-font-default, 35%);
        border-radius: $borderRadius-default;
      }

      // =======img==========
      img {
        max-width: 100%;
      }

      // ========格式化===========
      hr:has(+hr) {
        border: none;
        margin: 0;
      }

      hr+hr {
        border: none;
        margin: 0;
        page-break-after: always;
      }

      sup sub {
        font-size: .75em;
        line-height: 0;
      }

      b,
      strong,
      details>summary {
        font-weight: 700;
      }


      details,
      details>summary {
        cursor: pointer;
      }

      hr {
        margin: $fontSize-default*1.5 0;
        border-top: .25em solid $color-bg-hr;
      }



      // ==========blockquote===========

      blockquote {
        color: darken($color-bg-quote, 20%);
        position: relative;
        border: none;
        border-radius: $borderRadius-default;
        background-color: $color-bg-quote;
        padding: $fontSize-default*1.5;

        P {
          margin: 0;
          letter-spacing: 2px;
        }

        a {
          background-color: darken($color-bg-quote, 5%);
        }

        &::before,
        &::after {
          position: absolute;
          color: darken($color-bg-quote, 15%);
          font-size: $fontSize-default * 2;
          font-weight: 700;
        }

        &::before {
          content: "❝";
          top: 0px;
          left: 5px;
        }

        &::after {
          content: "❞";
          right: 5px;
          bottom: -5px;
        }
      }

      // ========末尾=========
      .footnotes {
        font-size: $fontSize-default * .75;
        color: lighten($color-font-default, 50%);


        ol {
          padding-left: $fontSize-default;
        }

        li {
          position: relative;


          &:target {
            color: $color-font-default;

            &::before {
              position: absolute;
              top: -8px;
              right: -8px;
              bottom: -8px;
              left: -24px;
              pointer-events: none;
              content: "";
              border: 2px solid $color-border-default;
              border-radius: 6px;
            }
          }
        }
      }

      // ===========结尾=========
    }
  }

  .markdown-box.coexist {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto 1fr;

    .markdown-head {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    .markdown-body {
      grid-row: 2;
      grid-column: 1;
    }

    .textarea {
      grid-row: 2;
      grid-column: 2;
      box-shadow: -1px 0px 1px $color-bg-hr;
    }
  }

  // 打印时
  @media print {
    .markdown-head {
      display: none;
    }
  }
</style>