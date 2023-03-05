<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted, ComponentInternalInstance, getCurrentInstance, nextTick } from "vue";
  import { onLoad } from '@dcloudio/uni-app';
  import { getClientInfo } from "@/utils/getClientInfo"
  import { initPositionStyle } from "@/utils/initPositionStyle"
  import { cf } from '@/utils/cf'
  import getMds from '@/tools/getMds';
  import type { Tip, Tag, Option } from '@/type'
  // 跳转时带的参数
  type Query = {
    needLogin ?: Boolean
    uniIdRedirectUrl ?: String
  }
  let query : Query;
  // 计划表数据获取
  let self : ComponentInternalInstance = getCurrentInstance()
  let tipList = reactive<Tip[]>([{
    id: 0,
    title: "完成一个计划表",
    createTime: Date.now(),
    isEnd: false,
    endTime: "",
  }
  ]);
  // ============tags-wrap===========
  let tags = reactive<Tag[]>([])
  // 设置
  let setOptions = reactive<Option[]>([{
    fontIcon: '&#xe603;',
    title: '登录'
  },
  {
    fontIcon: '&#xe97f;',
    title: '退出'
  }
  ])
  let showSet = ref<boolean>(false)
  // 插入模块
  // login
  let showLogin = ref<boolean>(false);

  function setSelect(option : Option) : void {
    showSet.value = false;
    let t = option.title;
    let funs = new Map()
    funs.set('登录', () => { showLogin.value = true })
    funs.set('退出', () => {
      try {
        uni.setStorageSync('uni_id_token', '')
      } catch (e) {
        uni.showToast({
          title: e.message,
          icon: 'error'
        })
      }
    })
    !funs.has(t) ? funs.get(t)() : uni.showToast({
      title: '该功能未设置'
    });
  }
  // ===========ajax===============
  function login(e : boolean) {
    if (e) {
      if (query && query.uniIdRedirectUrl) {
        setTimeout(() => uni.showToast({
          title: '返回之前访问页面',
        }), 1000)
        setTimeout(() => {
          showLogin.value = false;
          uni.redirectTo({
            url: query.uniIdRedirectUrl
          })
        }, 2000)

      }

    }
  }
  async function getTags() {
    let names = await getMds()
    names.map((n : string, i : number) => {
      tags.push({
        id: '' + i,
        src: '',
        href: '/pages/Article/Article?value=' + n,
        title: n.replace('.md', ''),
        sub: n.replace('.md', '')
      })
    })
  }
  getTags()
  // 需要登录时
  onLoad((q : Query) => {
    if (q.needLogin) {
      showLogin.value = true
      query = q
    }
  }
  )
  // =========挂载卸载============
  onMounted(() => {
  })
  onUnmounted(() => { })
</script>
<template>
  <view class="body">
    <!-- 第一区备忘录模块等模块1fr(左右空出放置按钮),第二区放置搜索框,第三区放置快捷方式,第四加个1fr放置备案信息-->
    <view class="module container">
      <!-- <ShowMessage class="show-message" /> -->
      <MyMemo :tipList='tipList' class="memo"></MyMemo>
      <Login class="login" v-if="showLogin" @login='login'></Login>
    </view>
    <SearchWrap class='container search-wrap'></SearchWrap>
    <TagsWrap :tagList='tags' class="tags-wrap"></TagsWrap>
    <!-- 固定信息部分 -->
    <image class="logo" src="@/static/img/logo.svg" />
    <text url="../login/login.vue" class="set hover-color icon" @tap='showSet=!showSet'>&#xe600;</text>
    <Options v-if="showSet" :options='setOptions' :showMask='true' class="set-options" @cancel='showSet=!showSet'
      @select='setSelect' />
    <MyFooter class="footer container"></MyFooter>
  </view>
</template>

~
<style lang="scss" scoped>
  .body {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto auto 1fr;
    gap: 10px;
    place-items: center;
    font-size: 16px;
    overflow: auto;
    position: relative;
  }

  .module {
    height: 100%;
    grid-row: 1;
    align-self: end;
    padding-top: 60px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    --color-white-1: hsl(207, 45%, 82%);
    --color-white-2: hsl(207, 45%, 85%);
    --color-shadow-1: #7496ab;
    --color-shadow-2: #a7c6dc;

    .memo {
      height: 300px;
      max-height: 300px;
      border-radius: 12px;
      background-color: var(--color-bg-quote);
      box-shadow: -1px -1px 2px var(--color-white-1),
        inset 1px 1px 1px var(--color-white-2),
        2px 2px 4px var(--color-shadow-1),
        inset -1px -1px 1px var(--color-shadow-2);
    }

    .login {
      height: 300px;
    }
  }

  .search-wrap {
    grid-row: 2;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .tags-wrap {
    grid-row: 3;
  }

  .footer {
    grid-row: -2;
    color: gray;
    place-self: end start;
  }

  // 固定组件
  .logo,
  .set,
  .set-options {
    top: 20px;
    transition: var(--transition-1);
  }

  .logo,
  .set {
    height: 30px;
  }

  .logo {
    object-fit: cover;
    width: auto;
    position: absolute;

    left: 30px;
  }

  .set {
    position: absolute;
    right: 30px;
    margin-right: 10px;
    font-size: var(--fontSize-default);


    &:active {
      transform: scale(.9);
    }
  }

  .set-options {
    position: absolute;
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
