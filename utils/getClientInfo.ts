import { ComponentInternalInstance } from "vue"
interface ClientInfo {
  clientLeft: number;
  clientRight: number;
  clientTop: number;
  clientBottom: number;
  clientWidth: number;
  clientHeight: number;
  windowWidth: number;
  windowHeight: number;
}
/** 
@param{string}selector 一个css选择器
@param{ComponentInternalInstance}self 当前组件实例对象
@returns Promise 返回组件相对视口位置,自身及设备高宽,
*/
function getClientInfo(selector: string, self: ComponentInternalInstance): Promise<ClientInfo> {
  return new Promise(res => {
    uni.createSelectorQuery().in(self).select(selector)
      .boundingClientRect(
      ).exec((data) => {
        data = data[0];
        let { windowWidth: wW, windowHeight: wH } = uni.getSystemInfoSync() as UniNamespace.GetSystemInfoResult
        let { height: h, width: w, left: l, top: t } = (data as UniNamespace.NodeInfo)
        let r = wW - l - w
        let b = wH - t - h
        let info: ClientInfo = { clientLeft: l, clientRight: r, clientTop: t, clientBottom: b, clientWidth: w, clientHeight: h, windowWidth: wW, windowHeight: wH }
        res(info)
      })
  })

}
export { getClientInfo, ClientInfo }