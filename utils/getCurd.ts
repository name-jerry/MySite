import useMainStore from "@/stores/useMainStore"
type CURD = "get" | "add" | "remove" | "update"
/**
 *泛型为表记录的类型,查询对应的表明,返回一个async函数
 * @param{string} collectionName - 表名
 * @return{promise} 返回一个async函数
 */
function getCurd<T>(collectionName : string) {
  let main = useMainStore()
  /**
   * @param{string} [type="get"] - "get" | "add" | "remove" | "update";
   * @param{any} [item] - 数据对象可选,删除,增加或修改时必填
   * @return{promise} 返回一个Promise;
   */
  return async function curd(type : CURD = "get", item ?: T) : Promise<any> {
    let { uid, tokenExpired } = uniCloud.getCurrentUserInfo();
    let islogin = !tokenExpired || tokenExpired < Date.now() ? false : true;
    if (!islogin) return main.isLogin = false;
    let tdb = uniCloud.databaseForJQL().collection(collectionName);
    let funs = new Map();
    funs.set('get', () => {
      if (collectionName == 'articles') {
        return tdb.where(`status==1||user_id=='${uid}'`).get()
      } else {
        return tdb.where(`user_id=='${uid}'`).get()
      }
    });
    funs.set("add", () => tdb.add(item));
    funs.set("remove", () => tdb.doc(item._id).remove())
    funs.set("update", () => {
      let c = { ...item };
      delete c._id;
      tdb.doc(item._id).update(c);
    })
    let res = funs.has(type) ? await funs.get(type)() : { errCode: '类型错误', data: [] };
    if (res?.errCode) throw new Error(res.errCode);
    return res
  }
}
export { getCurd, CURD }