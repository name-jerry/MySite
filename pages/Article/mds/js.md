# javsScript

js笔记

## vue-setup

关于setup中常用功能的笔记.

### 生命周期

根据[官方资料](https://uniapp.dcloud.net.cn/tutorial/page.html#componentlifecycle)及测试,常用生命周期排序:  
- 渲染时:launch~APP~=>show~APP~=>setup=>onLoad~页面~=>onshow~页面~=>beforeMounted=>onReady~页面~=>mounted  
```js
  onLoad((e) => {
    console.log('onLoad');
  })
  onReady(() => {
    console.log('onReady');
  })
  onShow(() => {
    console.log('onShow');
  })
  onBeforeMount(() => {
    console.log('onBeforeMount');
  })
```
![](vue-setup_files/1.jpg)

### 页面传参

- uniapp中页面路由的参数由onLoad接收,setup中则需要引入onLoad
```js
import { onLoad } from '@dcloudio/uni-app'
 onLoad((e) => {
    console.log(e);
  })
```
- 介于生命周期setup运行顺序靠前,无法获取到顺序靠后的load状态中的路由参数,此时需要引入onLoad生命钩子^[生命钩子:注册回调的函数,以load为例,起生命钩子就是`onLoad`,将想在load时运行的函数fun作为参数放入onLoad中`onLoad(fun)`,vue就会在组件进入load状态自动运行这些注册的函数],传参过来值都是string格式,判断是否值是否存在时要注意==undefined==也是字符串形式和js内部的undefined不同
```js
onLoad(e => {
    console.log('e.value=>', e.value);
    console.log('typeof e.value=>', typeof e.value);
    console.log('Boolean e.value=>', Boolean(e.value));
    // 这里我要接收的值是数字,所以通过+号隐式转换成数字格式,字符串转数字就是NAN,NAN做判断时就会隐式转换成false
    console.log('Boolean +e.value=>', Boolean(+e.value));
  })
```
![](vue-setup_files/2.jpg)

### vue全局捕获错误

```js
//main.js
  const app = createSSRApp(App)
  app.config.errorHandler = (err, instance, info) => {
    //接收三个参数：错误对象、触发该错误的组件实例和一个指出错误来源类型信息的字符串。
    console.warn(err, instance, info);
  }
```
## es6
### Set对象 
- set对象内部不可重复可以有效去重,增加子项`add(value)`
- set对象允许展开符`let array=[..setObject]`
```js
let array=[..setObject]
```
- 数组转Set
```js
let a=new Set([...array])
```

