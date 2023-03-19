import { ref, watch, Ref, WatchStopHandle } from "vue";
import type { CURD } from "./getCurd"
import useMainStore from "@/stores/useMainStore";
/** 泛型声明返回的数据类型,返回一个已经初始化的数组,监听登录状态切换时刷新数组.监听数组内容变化并存储数据
 *@param{Promise<any>}curd 通过getCurd获得一个数据库的索引
 *@param{string}key 一个存取数据的key
 * @return{Ref<T[]>}list 一个ref对象,存储着数据库read结果
 */
export function useRefresh<T>(curd : (type : CURD, item ?: T) => Promise<any>, key : string,) : { list : Ref<T[]> } {
  let main = useMainStore();
  let list : Ref<T[]> = ref([]);
  let stop : WatchStopHandle;
  let fn = () => { uni.setStorageSync(key, JSON.stringify(list.value)) };
  function setDateWhenUpdate() { stop = watch(list, fn, { deep: true }) }
  setDateWhenUpdate();
  async function refresh() {
    if (!main.isLogin) {
      typeof stop == 'function' && stop()
      list.value = [];
      setDateWhenUpdate()
      return
    }
    // main中监听了isLogin的变动,等于false时就会清空存储
    let l = uni.getStorageSync(key);
    if (l) return list.value = JSON.parse(l);
    let res = await curd("get")
    if (!res?.data?.length) return;
    list.value = res.data
  }
  watch(() => main.isLogin, refresh, { immediate: true })

  return { list }
}
