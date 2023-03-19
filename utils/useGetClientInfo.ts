import { ComponentInternalInstance, getCurrentInstance, onMounted, onUnmounted, Ref, ref } from "vue"
import { useEventListener } from "./event"
interface ClientInfo {
  left : number;
  right : number;
  top : number;
  bottom : number;
  width : number;
  height : number;
  windowWidth : number;
  windowHeight : number;
}
let { windowWidth: wW, windowHeight: wH } = uni.getSystemInfoSync() as UniNamespace.GetSystemInfoResult
/** 
@param{string}selector 一个css选择器
@param{ComponentInternalInstance}self 当前组件实例对象
@returns Promise 返回组件相对视口位置,自身及设备高宽,
*/
function useGetClientInfo(selector : string) : { clientInfo : Ref<ClientInfo> } {
  const self : ComponentInternalInstance = getCurrentInstance() as ComponentInternalInstance
  let clientInfo : Ref<ClientInfo> = ref()
  function updateClientInfo() {
    uni.createSelectorQuery().in(self).select(selector)
      .boundingClientRect(
      ).exec((data) => {
        data = data[0];
        let { height: h, width: w, left: l, top: t } = (data as UniNamespace.NodeInfo)
        let r = wW - l - w
        let b = wH - t - h
        clientInfo.value = { left: l, right: r, top: t, bottom: b, width: w, height: h, windowWidth: wW, windowHeight: wH }
      })
  }
  onMounted(() => {
    uni.onWindowResize(updateClientInfo);
  })
  onUnmounted(() => {
    uni.offWindowResize(updateClientInfo)
  })
  return { clientInfo }
}
export { useGetClientInfo }
