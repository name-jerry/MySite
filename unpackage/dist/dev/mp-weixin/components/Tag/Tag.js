"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_getClientInfo = require("../../utils/getClientInfo.js");
if (!Array) {
  const _easycom_Tag2 = common_vendor.resolveComponent("Tag");
  _easycom_Tag2();
}
const _easycom_Tag = () => Promise.resolve().then(() => RDovcHJvamVjdC9hcHAvTXlTaXRlL2NvbXBvbmVudHMvVGFnL1RhZy52dWU);
if (!Math) {
  _easycom_Tag();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Tag",
  props: {
    tag: null
  },
  emits: ["dot"],
  setup(__props, { emit }) {
    const { tag } = __props;
    let self = common_vendor.getCurrentInstance();
    let childrenStyle = common_vendor.reactive({});
    let isShowChildren = common_vendor.ref(false);
    let isShowShadow = common_vendor.ref(false);
    let isShowOptions = common_vendor.ref(false);
    let data;
    function tapDot() {
      isShowOptions.value = true;
      isShowShadow.value = true;
      isShowChildren.value = false;
    }
    function Toggle(e) {
      var _a;
      let isShadow = (_a = e.target.dataset) == null ? void 0 : _a.shadow;
      if (isShadow) {
        isShowChildren.value = false;
        isShowShadow.value = false;
        isShowOptions.value = false;
      } else {
        initLeftAndWidth();
        isShowChildren.value = true;
        isShowShadow.value = true;
        isShowOptions.value = false;
      }
    }
    async function initLeftAndWidth() {
      if (!tag.children || tag.children.length == 0)
        return;
      data = await utils_getClientInfo.getClientInfo(".tag-box", self);
      let { clientLeft: l, clientRight: r, clientTop: t, clientBottom: b } = data;
      if (l > r) {
        childrenStyle.right = "101%";
        childrenStyle.left = "initial";
      } else {
        childrenStyle.right = "initial";
        childrenStyle.left = "101%";
      }
      if (t > b) {
        childrenStyle.bottom = "-10px";
        childrenStyle.top = "initial";
      } else {
        childrenStyle.top = "-10px";
        childrenStyle.bottom = "initial";
      }
    }
    common_vendor.onMounted(() => {
      initLeftAndWidth();
      common_vendor.index.onWindowResize(initLeftAndWidth);
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.offWindowResize(initLeftAndWidth);
      isShowChildren.value = false;
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: __props.tag.src
      }, __props.tag.src ? {
        b: __props.tag.src
      } : {}, {
        c: __props.tag.title
      }, __props.tag.title ? {
        d: common_vendor.t(__props.tag.title)
      } : {}, {
        e: __props.tag.sub
      }, __props.tag.sub ? {
        f: common_vendor.t(__props.tag.sub)
      } : {}, {
        g: __props.tag.href && !__props.tag.children ? __props.tag.href : "javascript:void(0)",
        h: __props.tag.href && !__props.tag.children ? "_blank" : "",
        i: ((_a = __props.tag) == null ? void 0 : _a.children) && __props.tag.children.length > 0
      }, ((_b = __props.tag) == null ? void 0 : _b.children) && __props.tag.children.length > 0 ? {
        j: common_vendor.f(__props.tag.children, (item, k0, i0) => {
          return {
            a: item.id,
            b: "36dd27f3-0-" + i0,
            c: common_vendor.p({
              tag: item
            })
          };
        }),
        k: common_vendor.s(common_vendor.unref(childrenStyle))
      } : {}, {
        l: common_vendor.o(tapDot),
        m: common_vendor.unref(isShowShadow),
        n: common_vendor.unref(isShowOptions) ? 1 : "",
        o: common_vendor.unref(isShowChildren) ? 1 : "",
        p: common_vendor.o(Toggle)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36dd27f3"], ["__file", "D:/project/app/MySite/components/Tag/Tag.vue"]]);
wx.createComponent(Component);
const RDovcHJvamVjdC9hcHAvTXlTaXRlL2NvbXBvbmVudHMvVGFnL1RhZy52dWU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
