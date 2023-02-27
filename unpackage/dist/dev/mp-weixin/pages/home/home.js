"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_MyMemo2 = common_vendor.resolveComponent("MyMemo");
  const _easycom_Login2 = common_vendor.resolveComponent("Login");
  const _easycom_SearchWrap2 = common_vendor.resolveComponent("SearchWrap");
  const _easycom_TagsWrap2 = common_vendor.resolveComponent("TagsWrap");
  const _easycom_Options2 = common_vendor.resolveComponent("Options");
  const _easycom_MyFooter2 = common_vendor.resolveComponent("MyFooter");
  (_easycom_MyMemo2 + _easycom_Login2 + _easycom_SearchWrap2 + _easycom_TagsWrap2 + _easycom_Options2 + _easycom_MyFooter2)();
}
const _easycom_MyMemo = () => "../../components/MyMemo/MyMemo.js";
const _easycom_Login = () => "../../components/Login/Login.js";
const _easycom_SearchWrap = () => "../../components/SearchWrap/SearchWrap.js";
const _easycom_TagsWrap = () => "../../components/TagsWrap/TagsWrap.js";
const _easycom_Options = () => "../../components/Options/Options.js";
const _easycom_MyFooter = () => "../../components/MyFooter/MyFooter.js";
if (!Math) {
  (_easycom_MyMemo + _easycom_Login + _easycom_SearchWrap + _easycom_TagsWrap + _easycom_Options + _easycom_MyFooter)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    let tipList = common_vendor.reactive([
      {
        id: 0,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: false,
        endTime: ""
      },
      {
        id: 1,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      },
      {
        id: 2,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      },
      {
        id: 3,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      },
      {
        id: 4,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      },
      {
        id: 5,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      },
      {
        id: 6,
        title: "完成一个计划表",
        createTime: Date.now(),
        isEnd: true,
        endTime: ""
      }
    ]);
    let tags = common_vendor.reactive(
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
    );
    let setOptions = common_vendor.reactive([
      {
        fontIcon: "&#xe603;",
        title: "登录"
      },
      {
        fontIcon: "&#xe97f;",
        title: "退出"
      }
    ]);
    let showSet = common_vendor.ref(false);
    let showLogin = common_vendor.ref(false);
    function setSelect(option) {
      showSet.value = false;
      let t = option.title;
      if (t == "登录") {
        showLogin.value = true;
      }
    }
    async function test() {
      common_vendor.index.navigateTo({
        url: "/pages/Article/Article"
      });
    }
    common_vendor.onMounted(() => {
    });
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          tipList: common_vendor.unref(tipList)
        }),
        b: common_vendor.unref(showLogin)
      }, common_vendor.unref(showLogin) ? {} : {}, {
        c: common_vendor.p({
          tagList: common_vendor.unref(tags)
        }),
        d: common_assets._imports_0,
        e: common_vendor.o(test),
        f: common_vendor.o(($event) => common_vendor.isRef(showSet) ? showSet.value = !common_vendor.unref(showSet) : showSet = !common_vendor.unref(showSet)),
        g: common_vendor.unref(showSet)
      }, common_vendor.unref(showSet) ? {
        h: common_vendor.o(($event) => common_vendor.isRef(showSet) ? showSet.value = !common_vendor.unref(showSet) : showSet = !common_vendor.unref(showSet)),
        i: common_vendor.o(setSelect),
        j: common_vendor.p({
          options: common_vendor.unref(setOptions)
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"], ["__file", "D:/project/app/MySite/pages/home/home.vue"]]);
wx.createPage(MiniProgramPage);
