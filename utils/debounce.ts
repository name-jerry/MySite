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