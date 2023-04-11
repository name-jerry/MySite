import { defineStore } from 'pinia';
import { ref, watch, watchEffect } from "vue";
import { Article } from "@/type"
import { checkLogin } from "@/utils/checkLogin"
/**
 * isLogin,登录状态,改为fale时删除本地存储
 * artList,存放文章信息
 * online,在login时返回并确定,指定是否允许用户切换开启在线状态
 * isOnline,控制是否启动联网,默认false,如果online为true,需要用户切换以控制文章的上传和修改都是否同步到网上,计划表始终联网
 */
const useMainStore = defineStore('main', () => {
  let isLogin = ref<boolean>(checkLogin());
  let artList = ref<Article[]>([])
  /**只在login时变更online,用于设定是否允许在线*/
  let online = ref<boolean>(false);
  /**用户是否选择联网,只有online为true时才能选择*/
  let isOnline = ref<boolean>(false);
  initOnlineAndIsOnlineStatus()
  /**根据本地数据初始化联网状态*/
  function initOnlineAndIsOnlineStatus() {
    let main = uni.getStorageSync('main')
    if (typeof main?.online !== 'undefined') {
      online.value = main.online;
      isOnline.value = main.isOnline;
    }
  }
  /**联网权限变更影响isOline*/
  watch(online, () => {
    isOnline.value = online.value
  })
  // 将online数据持久化,退出登录时会清空存储,此时重新登录因为监听的online和isOnline对象都未变就不触发存储,所以增加isLogin主动触发一次存储
  watchEffect(() => {
    if (isLogin.value) {
      uni.setStorageSync('main', {
        online: online.value,
        isOnline: isOnline.value
      })
    }
  }
  )
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