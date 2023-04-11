import useMainStore from "@/stores/useMainStore"
type CURD = "get" | "add" | "remove" | "update"
type CURDFn = ((type ?: CURD, item ?: T) => Promise<any>)
/**
 *泛型为表记录的类型,查询对应的表名,返回一个async函数
 * @param{string} collectionName - 表名
 * @param{boolean} [isOnline=false] - 是否临时获得在线功能,无视main.isOnline,
 * @return{promise} 返回一个async函数,如果isOnline和main.isOnline都为false时第一行就会被return
 */
function getCurd<T>(collectionName : string, isOnline : boolean = false) : CURDFn {
  let main = useMainStore();
  let tdb = uniCloud.databaseForJQL().collection(collectionName);
  let funs = new Map();
  funs.set('get', (item, uid) => {
    if (collectionName == 'articles') {
      return tdb.where(`status==1||user_id=='${uid}'`).get()
    } else {
      return tdb.where(`user_id=='${uid}'`).get()
    }
  });
  funs.set("add", (item, uid) => tdb.add(item));
  funs.set("remove", (item, uid) => tdb.doc(item._id).remove())
  funs.set("update", (item, uid) => {
    let c = { ...item };
    delete c._id;
    tdb.doc(item._id).update(c);
  })
  /**
   * @param{string} [type="get"] - "get" | "add" | "remove" | "update";
   * @param{any} [item] - 数据对象可选,删除,增加或修改时必填
   * @return{promise} 返回一个Promise;
   */
  return async function curd(type : CURD = "get", item ?: T) : Promise<any> {
    if (!main.isOnline && !isOnline) return;
    let { uid, tokenExpired } = uniCloud.getCurrentUserInfo();
    let islogin = !tokenExpired || tokenExpired < Date.now() ? false : true;
    if (!islogin) return main.isLogin = false;
    let res = funs.has(type) ? await funs.get(type)(item, uid) : { errCode: '类型错误', data: [] };
    if (res?.errCode) throw new Error(res.errCode);
    return res
  }
}
export { getCurd, CURD, CURDFn }