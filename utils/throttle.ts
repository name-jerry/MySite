function throttle(fn : Function, time : number) : Function {
  let timer : NodeJS.Timeout;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, time);
  }
}
export { throttle }