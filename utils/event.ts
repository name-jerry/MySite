import { onMounted, onUnmounted } from 'vue'
type E = keyof WindowEventHandlersEventMap | keyof GlobalEventHandlersEventMap
/**
 * 在组件挂载阶段绑定事件,卸载时移除事件 
 * @param {HTMLElement}  target - 需要绑定事件的html元素
 * @param {string} event - 事件名不带on
 * @param {function} callback - 要绑定的回调
 */
export function useEventListener(target : HTMLElement | Window, event : E, callback : EventListenerOrEventListenerObject) : void {
  onMounted(() => {
    target.addEventListener(event, callback);
  })
  onUnmounted(() => target.removeEventListener(event, callback))
}