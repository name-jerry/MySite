"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_Mask2 = common_vendor.resolveComponent("Mask");
  _easycom_Mask2();
}
const _easycom_Mask = () => "../Mask/Mask.js";
if (!Math) {
  _easycom_Mask();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Options",
  props: {
    options: null
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.options, (item, k0, i0) => {
          return common_vendor.e({
            a: item.fontIcon
          }, item.fontIcon ? {
            b: item.fontIcon
          } : {}, {
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => _ctx.$emit("select", item), item.title),
            e: item.title
          });
        }),
        b: common_vendor.o(($event) => _ctx.$emit("cancel"))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-84d8f079"], ["__file", "D:/project/app/MySite/components/Options/Options.vue"]]);
wx.createComponent(Component);
