"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "PasswordInput",
  setup(__props) {
    let show = common_vendor.ref(false);
    return (_ctx, _cache) => {
      return {
        a: !common_vendor.unref(show),
        b: common_vendor.unref(show) ? "" : "",
        c: common_vendor.o(($event) => common_vendor.isRef(show) ? show.value = !common_vendor.unref(show) : show = !common_vendor.unref(show)),
        d: common_vendor.n(_ctx.$attrs.class)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6e294ecc"], ["__file", "D:/project/app/MySite/components/PasswordInput/PasswordInput.vue"]]);
wx.createComponent(Component);
