import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target : HTMLElement | Window, event : keyof WindowEventHandlersEventMap | keyof GlobalEventHandlersEventMap, callback : (e : CustomEvent) => void) : void {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
