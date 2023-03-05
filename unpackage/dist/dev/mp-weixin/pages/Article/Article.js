"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Article",
  setup(__props) {
    let text = common_vendor.ref("");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(text)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13ef32af"], ["__file", "D:/project/app/MySite/pages/Article/Article.vue"]]);
wx.createPage(MiniProgramPage);
