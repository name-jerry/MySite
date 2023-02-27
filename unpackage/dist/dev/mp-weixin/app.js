"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/Article/Article.js";
}
const _sfc_main = {
  onLaunch: function() {
    let updateManager = common_vendor.index.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate)
        console.log("有新版本");
    });
    updateManager.onUpdateReady(() => {
      common_vendor.index.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm)
            updateManager.applyUpdate();
        }
      });
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/app/MySite/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
