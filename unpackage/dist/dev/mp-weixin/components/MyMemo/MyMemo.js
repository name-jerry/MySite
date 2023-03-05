"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_Tip2 = common_vendor.resolveComponent("Tip");
  _easycom_Tip2();
}
const _easycom_Tip = () => "../Tip/Tip.js";
if (!Math) {
  _easycom_Tip();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MyMemo",
  props: {
    tipList: null
  },
  setup(__props) {
    const { tipList } = __props;
    let tipNum = common_vendor.ref(0);
    let move = common_vendor.computed(() => `translateX(${-50 * tipNum.value}%)`);
    async function tipUpdate(tip) {
      if (!tip.title) {
        let i = tipList.findIndex((item) => {
          return item.id == tip.id;
        });
        tipList.splice(i, 1);
        return;
      }
      tipList[tip.id] = tip;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.tipList, (item, k0, i0) => {
          return common_vendor.e({
            a: !item.isEnd
          }, !item.isEnd ? {
            b: common_vendor.o(tipUpdate, item.id),
            c: "eaead644-0-" + i0,
            d: common_vendor.p({
              tip: item
            })
          } : {}, {
            e: item.id
          });
        }),
        b: common_vendor.f(__props.tipList, (item, k0, i0) => {
          return common_vendor.e({
            a: item.isEnd
          }, item.isEnd ? {
            b: common_vendor.o(tipUpdate, item.id),
            c: "eaead644-1-" + i0,
            d: common_vendor.p({
              tip: item
            })
          } : {}, {
            e: item.id
          });
        }),
        c: common_vendor.unref(move),
        d: common_vendor.unref(tipNum) == 0 ? 1 : "",
        e: common_vendor.o(($event) => common_vendor.isRef(tipNum) ? tipNum.value = 0 : tipNum = 0),
        f: common_vendor.unref(tipNum) == 1 ? 1 : "",
        g: common_vendor.o(($event) => common_vendor.isRef(tipNum) ? tipNum.value = 1 : tipNum = 1)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eaead644"], ["__file", "D:/project/app/MySite/components/MyMemo/MyMemo.vue"]]);
wx.createComponent(Component);
