import { defineStore } from 'pinia';
import { ref, watch, } from "vue";
import { Article } from "@/type"
import { checkLogin } from "@/utils/checkLogin"

const useMainStore = defineStore('main', () => {
  let isLogin = ref<Boolean>(checkLogin());
  let artList = ref<Article[]>([])
  // 退出时清空数据
  watch(isLogin, () => {
    if (!isLogin.value) {
      uni.clearStorageSync()
    }
  }, { immediate: true })
  return {
    isLogin,
    artList
  }
});
export default useMainStore
