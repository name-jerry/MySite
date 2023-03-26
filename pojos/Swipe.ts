
/**
 * 传入一个元素,将元素内部的innerHTML翻倍,每几秒移动一个HTMLODM,移动到一半的,就重回开头
 *@clasdesc 
 * @class 
 */
class Swipe {
  el : HTMLElement;
  // 初始下标
  current : number = 0;
  // swipe子类
  children : HTMLCollection;
  // 子类个数
  length : number;
  // 展示的个数
  showCount = 3;
  // 自动播放
  isAutoRun : boolean;
  runStatus : boolean;
  cancelRun : number;
  deStartRun : () => void;

  constructor(el : HTMLElement, options = { isAutoRun: true }) {
    let isDom = el instanceof HTMLElement;
    if (!isDom) throw new Error("swipe：传入的不是dom");
    el.innerHTML += el.innerHTML
    this.el = el;
    this.children = el.children;
    this.length = el.children.length;
    this.moveTo(0);
    this.toggleTransition(true)
    this.isAutoRun = options.isAutoRun;
    this.runStatus = options.isAutoRun;
    this.deStartRun = (() => {
      let canel : number;
      return function () {
        if (canel) clearTimeout(canel);
        canel = setTimeout(() => {
          this.startRun()
        }, 3000) as unknown as number
      }
    })()
    if (options.isAutoRun) {
      this.startRun();
    }
  }
  // 控制父组件移动,移动到第x个子类的左侧x左边处
  moveTo(x : number) {
    let distance = this.children[x].offsetLeft;
    this.el.style.transform = `translateX(${-distance}px)`;
  }
  clickNext() {
    this.pausedRun();
    this.next()
    if (this.isAutoRun) this.deStartRun();
  }
  next() {
    // 子类已经翻倍,走到一半时
    if (this.current == this.length / 2) {
      this.toggleTransition(false);
      this.current = 0;
      this.moveTo(this.current);
      setTimeout(() => {
        this.toggleTransition(true);
        this.moveTo(this.current += 1);
      }, 2)
    } else {
      this.moveTo(this.current += 1);
    }
  }
  prev() {
    this.pausedRun();
    // 如果第一个时
    if (this.current == 0) {
      // 设置过度效果
      this.toggleTransition(false);
      this.current = this.length / 2;
      this.moveTo(this.current);
      setTimeout(() => {
        this.toggleTransition(true);
        this.moveTo(this.current -= 1);
      }, 2);
    } else {
      this.moveTo(this.current -= 1);
    }
    // 设置几秒后自动滚动
    if (this.isAutoRun) this.deStartRun();
  }

  // 控制父组件移动效果
  toggleTransition(isTransition : boolean) {
    if (isTransition) {
      this.el.style.transition = ".5s ease";
    } else {
      this.el.style.transition = "none";
    }
  }
  toggleRunStatus() {
    if (this.runStatus) {
      this.isAutoRun = false
      this.pausedRun();
    } else {
      this.isAutoRun = true
      this.startRun();
    }
  }
  startRun(interval = 2000) {
    this.runStatus = true
    if (!this.cancelRun) this.next();
    this.cancelRun = setInterval(() => {
      this.next();
    }, interval) as unknown as number;
  }
  pausedRun() {
    this.runStatus = false
    clearInterval(this.cancelRun);
    this.cancelRun = null;
  }


}
export { Swipe }