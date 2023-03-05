"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_Tag2 = common_vendor.resolveComponent("Tag");
  _easycom_Tag2();
}
const _easycom_Tag = () => "../Tag/Tag.js";
if (!Math) {
  _easycom_Tag();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TagsWrap",
  props: {
    tagList: null
  },
  setup(__props) {
    let tagsWrapStyle = common_vendor.reactive({
      gap: "20px",
      "--tag-width": "150px"
    });
    let showTagsCount = common_vendor.ref(0);
    function updateShowCount() {
      let { windowWidth: wW } = common_vendor.index.getSystemInfoSync();
      let w;
      let g;
      if (wW <= 575) {
        wW -= 20;
      } else if (wW <= 768) {
        wW = 540;
      } else if (wW <= 992) {
        wW = 720;
      } else if (wW <= 1200) {
        wW = 930;
      } else if (wW > 1200) {
        wW = 1140;
      }
      let { gap, "--tag-width": width } = tagsWrapStyle;
      g = +gap.replace("px", "");
      w = +width.replace("px", "");
      let c = (wW + g) / (w + g) | 0;
      showTagsCount.value = 2 * c - 1;
    }
    updateShowCount();
    common_vendor.onMounted(() => {
      common_vendor.index.onWindowResize(updateShowCount);
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.offWindowResize(updateShowCount);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.tagList, (item, key, i0) => {
          return common_vendor.e({
            a: key < common_vendor.unref(showTagsCount)
          }, key < common_vendor.unref(showTagsCount) ? {
            b: "1ab27343-0-" + i0,
            c: common_vendor.p({
              tag: item
            })
          } : {}, {
            d: item.id
          });
        }),
        b: common_vendor.o(() => {
        }),
        c: common_vendor.s(common_vendor.unref(tagsWrapStyle))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1ab27343"], ["__file", "D:/project/app/MySite/components/TagsWrap/TagsWrap.vue"]]);
wx.createComponent(Component);
