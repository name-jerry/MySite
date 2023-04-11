import { defineStore } from 'pinia';
import { ref, watch } from "vue";
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
  /**只在login时变更online,用于设定是否允许在线*/
  let online = ref<boolean>(false);
  let isOnline = ref<boolean>(false);
  watch(isLogin, () => {
    if (!isLogin.value) {
      online.value = false
    } else {
      let o = uni.getStorageSync('online')
      online.value = o ? true : false
    }
  }, { immediate: true })
  watch(online, () => {
    let b = online.value
    uni.setStorageSync('online', b)
    isOnline.value = b
  }, { immediate: true });
  /**在允许在线的时候可以切换isOnline*/
  function switchOnlineStatus() : void {
    if (online.value) {
      isOnline.value = !isOnline.value;
    } else {
      uni.showModal({ title: '提示', content: '读写资源有限,暂不开放读写功能' });
    }
  }
  // 退出时清空数据,选择退出时才清空
  // watch(isLogin, () => {
  //   if (!isLogin.value) {
  //     uni.clearStorageSync()
  //   }
  // }, { immediate: true })
  return {
    isLogin,
    artList,
    isOnline,
    online,
    switchOnlineStatus,
  }
});
export default useMainStore