# node.js

## path

常用join功能,此功能会根据系统自动转换路径中的`/,\`符号,避免兼容问题

```js
let fs = require('fs')
let path = require('path')
let a1 = path.join(__dirname, '/pages/Article')
console.log('a1', a1); //a1 D:\project\app\MySite\pages\Article
let a2 = path.join(__dirname, './pages/Article')
console.log('a2', a2); //a2 D:\project\app\MySite\pages\Article
let a3 = path.join(__dirname + '/pages/Article')
console.log('a3', a3); //a3 D:\project\app\MySite\pages\Article
let a4 = __dirname + '/pages/Article'
console.log('a4', a4); //a4 D:\project\app\MySite/pages/Article
```