/**
 * 防抖包装，闭包返回一个包装过的函数
 * @param { Function } fn - 待包装的原函数
 * @param { number } time - 延迟时间
 * @return {Function} 包装过的函数
 * */
function debounce(fn : Function, time : number) : Function {
  let timeout = null;
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, time);
  }
};
export { debounce }