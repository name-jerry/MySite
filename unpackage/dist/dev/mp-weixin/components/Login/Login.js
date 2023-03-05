"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_PasswordInput2 = common_vendor.resolveComponent("PasswordInput");
  _easycom_PasswordInput2();
}
const _easycom_PasswordInput = () => "../PasswordInput/PasswordInput.js";
if (!Math) {
  _easycom_PasswordInput();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Login",
  setup(__props) {
    let isRegister = common_vendor.ref(false);
    let form = common_vendor.reactive({
      acc: "",
      pwd1: "",
      pwd2: ""
    });
    function loginBtn(e) {
      console.log(form);
      if (form.acc || form.pwd1) {
        common_vendor.index.showToast({
          title: " 请输入信息"
        });
      }
    }
    function registerBtn(e) {
      console.log(form);
      if (form.acc || form.pwd1) {
        common_vendor.index.showToast({
          title: "请输入信息"
        });
      } else if (form.pwd1 !== form.pwd2) {
        common_vendor.index.showToast({ title: "密码不一致" });
      }
    }
    function clearForm() {
      form.acc = "";
      form.pwd1 = "";
      form.pwd2 = "";
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(form).acc,
        b: common_vendor.o(($event) => common_vendor.unref(form).acc = $event.detail.value),
        c: common_vendor.o(($event) => common_vendor.unref(form).pwd1 = $event),
        d: common_vendor.p({
          placeholder: "输入密码",
          modelValue: common_vendor.unref(form).pwd1
        }),
        e: common_vendor.o(loginBtn),
        f: common_vendor.unref(form).acc,
        g: common_vendor.o(($event) => common_vendor.unref(form).acc = $event.detail.value),
        h: common_vendor.o(($event) => common_vendor.unref(form).pwd1 = $event),
        i: common_vendor.p({
          placeholder: "输入密码",
          modelValue: common_vendor.unref(form).pwd1
        }),
        j: common_vendor.o(($event) => common_vendor.unref(form).pwd2 = $event),
        k: common_vendor.p({
          placeholder: "再次输入密码",
          modelValue: common_vendor.unref(form).pwd2
        }),
        l: common_vendor.o(registerBtn),
        m: common_vendor.o(($event) => [common_vendor.isRef(isRegister) ? isRegister.value = false : isRegister = false, clearForm()]),
        n: common_vendor.o(($event) => [common_vendor.isRef(isRegister) ? isRegister.value = true : isRegister = true, clearForm()]),
        o: common_vendor.unref(isRegister) ? 1 : ""
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ac897abc"], ["__file", "D:/project/app/MySite/components/Login/Login.vue"]]);
wx.createComponent(Component);
