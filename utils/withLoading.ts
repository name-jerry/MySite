const defaultOptions = {
  title: 'j加载中',
  duration: 2000,
  mask: true
}
/**
 * 传入一个方法fn,在它执行周期内,加上全屏loading
 * 如果：
 * 1. fn是同步方法，结束后隐藏loading
 * 2. 如果是异步方法，resolve后隐藏loading
 * 3. 报错后隐藏loading并抛出错误
 * @param  fn 第一个参数是待包装的函数,需要指定泛型
 * @param options 第二个可选是uni.showLoading的参数
 * @returns Function 一个新的函数，去执行它吧
 */
const withLoading = (fn, options : UniNamespace.ShowLoadingOptions) => {
  const showLoading = (options : UniNamespace.ShowLoadingOptions) => {
    uni.showLoading(options)
  }
  const hideLoading = () => {
    uni.hideLoading()
  }
  const _options = Object.assign(defaultOptions, options)
  const newFn = (...args) => {
    try {
      showLoading(_options)
      const result = (fn as unknown as Function)(...args)
      const isPromise = result instanceof Promise
      if (!isPromise) {
        hideLoading()
        return result
      }
      return result
        .then((res) => {
          hideLoading()
          return res
        })
        .catch((err) => {
          hideLoading()
          throw err
        })
    } catch (err) {
      hideLoading()
      throw err
    }
  }
  return newFn
}
export default withLoading
