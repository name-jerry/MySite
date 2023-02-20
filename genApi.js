// node运行自动生成api下的文件名
let fs = require('fs')
let funPath = __dirname + '/uniCloud-aliyun/cloudfunctions/fun/'
let files = fs.readdirSync(funPath + 'apis');
fs.writeFileSync(funPath + 'apis.js', 'module.exports=' + JSON.stringify(files))
