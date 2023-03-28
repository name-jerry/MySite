import { ref, onMounted, onUnmounted, nextTick } from "vue";
import type { Ref } from "vue";

/**
 *监听keydow事件,返回一个动态变更的keyStatus
 * @return {{ref<string>}} 随按键变更内容
 */
function useShortcut() : { keyStatus : Ref<String> } {
  const keyStatus : Ref<String> = ref()
  const fns = new Map()
  fns.set('KeyA', () => keyStatus.value = 'switch')
  fns.set('KeyS', () => keyStatus.value = 'save')
  fns.set('KeyD', () => keyStatus.value = 'download')
  function keydown(e : KeyboardEvent) {
    let k = e.code;
    if (!e.ctrlKey || !fns.has(k)) return;
    e.preventDefault();
    fns.get(k)();
  }
  onMounted(() => window.addEventListener('keydown', keydown));
  onUnmounted(() => window.removeEventListener('keydown', keydown));
  return { keyStatus }
}
export { useShortcut }