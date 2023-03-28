import { defineStore } from 'pinia';
import { ref, watch, } from "vue";
import { Article } from "@/type"
import { checkLogin } from "@/utils/checkLogin"

/**
 * isLogin,登录状态,改为fale时删除本地存储
 * artList,存放文章信息
 * isOnline,控制是否启动联网,默认false,控制文章的上传和修改都是否同步到网上,计划表始终联网
 */
const useMainStore = defineStore('main', () => {
  let isLogin = ref<boolean>(checkLogin());
  let artList = ref<Article[]>([])
  let isOnLine = ref<boolean>(false)
  // 退出时清空数据,选择退出时才清空
  // watch(isLogin, () => {
  //   if (!isLogin.value) {
  //     uni.clearStorageSync()
  //   }
  // }, { immediate: true })
  return {
    isLogin,
    artList,
    isOnLine,
  }
});
export default useMainStore