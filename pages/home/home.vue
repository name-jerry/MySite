<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted, ComponentInternalInstance, getCurrentInstance, nextTick } from "vue";
  import { getClientInfo } from "@/utils/getClientInfo"
  import { initPositionStyle } from "@/utils/initPositionStyle"
  import { cf } from '@/utils/cf'
  import { format } from "url";
  import { promises } from "fs";
  // 计划表数据获取
  console.log(!new RegExp(null));
  let self: ComponentInternalInstance = getCurrentInstance()
  let tipList = reactive < Tip[] > ([{
      id: 0,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: false,
      endTime: "",
    },
    {
      id: 1,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
    {
      id: 2,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
    {
      id: 3,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
    {
      id: 4,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
    {
      id: 5,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
    {
      id: 6,
      title: "完成一个计划表",
      createTime: Date.now(),
      isEnd: true,
      endTime: "",
    },
  ]);
  // ============tags-wrap===========
  let tags = reactive < Tag[] > (
    [{
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "资源",
      sub: "常用的素材",
      children: [{
        src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
        title: "子1",
        sub: "常用的素材",
        children: [{
          src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
          title: "子1",
          sub: "常用的素材",
          children: []
        }, {
          src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
          title: "子2",
          sub: "常用的素材",
          children: [{
            src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
            title: "子1",
            sub: "常用的素材",
            children: []
          }, {
            src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
            title: "子2",
            sub: "常用的素材",
            children: [{
              src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
              title: "子1",
              sub: "常用的素材",
              children: []
            }, {
              src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
              title: "子2",
              sub: "常用的素材",
              children: []
            }]
          }]
        }]
      }, {
        src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
        title: "子2",
        sub: "常用的素材",
        children: []
      }]
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "资源",
      sub: "常用的素材",
      children: [{
        src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
        title: "子1",
        sub: "常用的素材",
        children: []
      }, {
        src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
        title: "子2",
        sub: "常用的素材",
        children: []
      }]
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }, {
      src: "https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg",
      title: "子2",
      sub: "常用的素材",
      children: []
    }]
  )
  // 设置
  let setOptions = reactive < Option[] > ([{
      fontIcon: '&#xe603;',
      title: '登录'
    },
    {
      fontIcon: '&#xe97f;',
      title: '退出'
    }
  ])
  let showSet = ref < boolean > (false)
  // 插入模块
  // login
  let showLogin = ref < boolean > (false);

  function setSelect(option: Option): void {
    showSet.value = false;
    let t = option.title;
    if (t == '登录') {
      showLogin.value = true
    }
  }
  // ===========ajax===============

  async function test(): Promise < any > {
    // let { result }: { result: unknown } = await cf({ api: 'login', data: { test: 1 } })
    uni.navigateTo({
      url: '/pages/uni-id-users/add'
    })
  }

  // =========挂载卸载============
  onMounted(() => {

  })
  onUnmounted(() => {})
</script>
<template>
  <view class="body">
    <!-- 第一区备忘录模块等模块1fr(左右空出放置按钮),第二区放置搜索框,第三区放置快捷方式,第四加个1fr放置备案信息-->
    <view class="module container">
      <!-- <ShowMessage class="show-message" /> -->
      <MyMemo :tipList='tipList' class="memo"></MyMemo>
      <Login class="login" v-if="showLogin"></Login>
    </view>
    <SearchWrap class='container search-wrap'></SearchWrap>
    <TagsWrap :tagList='tags' class="tags-wrap"></TagsWrap>
    <!-- 固定信息部分 -->
    <img class="logo" src="@/static/img/logo.svg" @tap='test' />
    <text url="../login/login.vue" class="set hover-color icon" @tap='showSet=!showSet'>&#xe600;</text>
    <Options v-if="showSet" :options='setOptions' class="set-options" @cancel='showSet=!showSet' @select='setSelect' />
    <MyFooter class="footer container"></MyFooter>
  </view>
</template>


<style lang="scss" scoped>
  .body {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto auto 1fr;
    gap: 10px;
    place-items: center;
    font-size: 16px;

  }

  .module {
    height: 100%;
    grid-row: 1;
    align-self: end;
    padding-top: 60px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    --color-white-1: hsl(199, 70%, 90%);
    --color-white-2: hsl(199, 70%, 95%);
    --color-shadow-1: hsl(199, 60%, 70%);
    --color-shadow-2: hsl(199, 70%, 86%);

    .memo {
      height: 300px;
      max-height: 300px;
      background-color: var(--color-3);
      box-shadow: -4px -4px 8px var(--color-white-1),
        inset 1px 1px 1px var(--color-white-2),
        6px 6px 12px -2px var(--color-shadow-1),
        inset -1px -1px 1px var(--color-shadow-2);
      ;
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

  .logo {
    object-fit: cover;
    height: 30px;
    position: absolute;
    left: 30px;
  }

  .set {
    position: absolute;
    right: 30px;
    font-size: var(--fontSize-4);
    width: 30px;

    &:active {
      transform: scale(.9);
    }
  }

  .set-options {
    position: absolute;
    right: 60px;
    font-size: var(--fontSize-5);
    background-color: var(--color-white);
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
