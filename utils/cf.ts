/**
 * 添加加载效果
 * 自动存取token
 * 捕获系统及业务层面的错误,并以toast提醒,业务错误时仍返回请求结果
*@param{object}data 传给后端的数据对象
*@return 返回一个Promise
*/
export default async function cf(data : any) : Promise<any> {
  let showLoading = () => {
    uni.showLoading({
      title: '加载中',
      mask: true
    })
  }
  let hideLoding = () => { uni.hideLoading() }
  showLoading()
  try {
    data.token = uni.getStorageSync('uni_id_token');
  } catch (e) {
    hideLoding()
    console.log(e);
  }
  return uniCloud.callFunction({
    name: 'fun',
    data
  }).then(res => {
    hideLoding()
    let { result } = res
    if (!result.success) {
      uni.showToast({
        title: result.errMsg,
        icon: "none"
      })
    } else {
      result.token && uni.setStorageSync('uni_id_token', result.token)
    }
    return result
  }).catch(err => {
    hideLoding()
    uni.showToast({
      title: '网络错误' + err.errMsg,
      icon: "none"
    })
  })
}