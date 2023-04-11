import { ref, watch, Ref, WatchStopHandle } from "vue";
import type { CURDFn } from "./getCurd"
import useMainStore from "@/stores/useMainStore";

/** 泛型声明返回的数据类型,返回一个已经初始化的数组,监听登录状态切换时刷新数组,优先获取本地数据.监听数组内容变化并存储数据,只是用get功能
 *@param{Promise<any>}curd 通过getCurd获得一个数据库的索引
 *@param{string}key 一个存取数据的key
 * @return{Ref<T[]>}list 一个ref对象,存储着数据库read结果
 */
export function useRefresh<T>(curd : CURDFn, key : string,) : { list : Ref<T[]> } {
  let main = useMainStore();
  let list : Ref<T[]> = ref([]);
  let stopUpdateStorage : WatchStopHandle;
  updateStorageByList();
  watch(() => main.isLogin, updateWithLoginStatus, { immediate: true })
  return { list }
  function updateStorageByList() {
    stopUpdateStorage = watch(list, () => { uni.setStorageSync(key, JSON.stringify(list.value)) }, { deep: true })
  }
  async function updateWithLoginStatus() {
    // 未登录状态时清空列表
    if (!main.isLogin) {
      typeof stopUpdateStorage == 'function' && stopUpdateStorage()
      list.value = [];
      updateStorageByList()
      return
    }
    // 登录状态时
    let l = uni.getStorageSync(key);
    // 本地有值时
    if (l) return list.value = JSON.parse(l);
    // 本地无值时获取线上数据
    let res = await curd("get")
    // 判断线上是否有值
    list.value = res?.data?.length ? res.data : [];
  }
}