"use strict";
const common_vendor = require("../common/vendor.js");
function getClientInfo(selector, self) {
  return new Promise((res) => {
    common_vendor.index.createSelectorQuery().in(self).select(selector).boundingClientRect().exec((data) => {
      data = data[0];
      let { windowWidth: wW, windowHeight: wH } = common_vendor.index.getSystemInfoSync();
      let { height: h, width: w, left: l, top: t } = data;
      let r = wW - l - w;
      let b = wH - t - h;
      let info = { clientLeft: l, clientRight: r, clientTop: t, clientBottom: b, clientWidth: w, clientHeight: h, windowWidth: wW, windowHeight: wH };
      res(info);
    });
  });
}
exports.getClientInfo = getClientInfo;
