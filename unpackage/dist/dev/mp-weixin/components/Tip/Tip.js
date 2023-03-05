"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Tip",
  props: {
    tip: null
  },
  emits: ["update"],
  setup(__props, { emit }) {
    const { tip } = __props;
    let copy = common_vendor.reactive({
      ...tip
    });
    let isActive = common_vendor.ref(false);
    function confirm(tip2) {
      emit("update", tip2);
      console.log(copy);
      isActive.value = !isActive.value;
    }
    function check(tip2) {
      tip2.isEnd = !tip2.isEnd;
      emit("update", tip2);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(isActive),
        b: common_vendor.unref(copy).isEnd,
        c: common_vendor.o(($event) => check(common_vendor.unref(copy))),
        d: !common_vendor.unref(isActive),
        e: common_vendor.unref(isActive) ? 1 : "",
        f: common_vendor.unref(copy).title,
        g: common_vendor.o(($event) => common_vendor.unref(copy).title = $event.detail.value),
        h: common_vendor.t(!common_vendor.unref(isActive) ? "编辑" : common_vendor.unref(copy).title ? "确认" : "删除"),
        i: common_vendor.o(($event) => confirm(common_vendor.unref(copy))),
        j: common_vendor.unref(isActive) ? 1 : "",
        k: common_vendor.unref(copy).isEnd ? 1 : ""
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4a26d5fb"], ["__file", "D:/project/app/MySite/components/Tip/Tip.vue"]]);
wx.createComponent(Component);
