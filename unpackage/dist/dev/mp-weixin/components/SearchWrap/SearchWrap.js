"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SearchWrap",
  setup(__props) {
    let toolList = common_vendor.reactive([
      { label: "百度", value: "https://www.baidu.com/s?wd=" },
      { label: "bing", value: "https://cn.bing.com/search?q=" }
    ]);
    let searchWord = common_vendor.ref("");
    let index = common_vendor.ref(0);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(searchWord),
        b: common_vendor.o(($event) => common_vendor.isRef(searchWord) ? searchWord.value = $event.detail.value : searchWord = $event.detail.value),
        c: common_vendor.t(common_vendor.unref(toolList)[common_vendor.unref(index)].label),
        d: common_vendor.o((e) => {
          common_vendor.isRef(index) ? index.value = e.detail.value : index = e.detail.value;
        }),
        e: common_vendor.unref(toolList),
        f: common_vendor.unref(toolList)[common_vendor.unref(index)].value + common_vendor.unref(searchWord)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-54dcf8d6"], ["__file", "D:/project/app/MySite/components/SearchWrap/SearchWrap.vue"]]);
wx.createComponent(Component);
