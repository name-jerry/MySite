# 常用代码块
## 根据目录生成生成模块文件
1. 最终代码运行在非node端时,比如web项目木,需要外置文档手动启动生成目录模块
```js
// node运行自动生成api下的文件名
let fs = require('fs')
let path = require('path')
let funPath = path.join(__dirname + '/uniCloud-aliyun/cloudfunctions/fun/')
let files = fs.readdirSync(funPath + 'apis');
fs.writeFileSync(funPath + 'apis.js', JSON.stringify(files))
```
2. 最终代码运行在node端时,比如云端时将方法内置到入口文件中,直接生成目录数组

```js
// 导入apis下所有函数名
let fs = require('fs')
let path = require('path')
let p = path.join(__dirname + '/apis')
let apis = fs.readdirSync(p);
let funs = new Map()
// 加载模块
apis.map(item => {
  let type = item.replace('.js', '')
  funs.set(type, require('./apis/' + item))
})

```

3. js复制行为

```js
if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      let text = this.querySelector('code').innerText;
      navigator.clipboard.writeText(text)
        .then(() => alert('复制成功'))
        .catch((e) => alert('复制失败'));
    } else if (document.execCommand) {
      //  execCommand被废弃的API,部分浏览器支持,作为clipboard不存在时的备选
      let txa = document.createElement('textarea')
      txa.value = this.querySelector('code').innerText
      document.body.appendChild(txa)
      txa.select()
      let res = document.execCommand('copy')
      document.body.removeChild(txa)
      alert(res ? '复制成功' : '复制失败');
``` 
