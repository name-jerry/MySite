# uniapp项目笔记

这篇文章是按个人开发的逻辑顺序书写的,罗列常用代码块及接口格式.
- 如果你==刚接触uniapp==,对于官方丰富的文档内容无所适从,这篇文章会很适合你,跟着文章思路,你可以了解前后端交互的几个关键api,同时跟着文章可以快速构建一份前后端交互的框架
- 如果你有不同的见解,或则发现文章有不妥的地方也请不吝赐教,最终希望大家都能写出足够优雅的代码.

## 云函数的调用
### 前端调用的方法
uniCloud.callFunction({name,data:{}}),其中name对应cloudfunctions下调用的文件名,比如
  ```js
  // 客户端发起调用云函数hellocf，并传入data数据
  uniCloud.callFunction({
  name: 'hellocf',
  data: {a:1,b:2}
  }).then((res) => {
  console.log(res.result) // 结果是 {sum: 3}
  }).catch((err) => {
  console.error(err)
  })
  ```
### 后端接收
参数event为callFunciton中data的属性,context为调用方的上下文
  ```js
  // 云函数hellocf对应目录cloudfunctions/hellocf,在hellocf目录下有一个index.js入口文件(就是调用该云函数时会运行到的文件)
  // 云函数hellocf内
  'use strict';
  exports.main = async (event, context) => {
   //event为客户端中的data参数,这里就是{a:1,b:2}
   let c = event.a + event.b
   return {
    sum: c
   } // return后面就是返回给前端的结果,存放在result中
  }
  ```
- 后端返回的数据格式,只有result对应我们return的数据,其余都是云平台自动生成
  ```json
  {
   "errCode": 0,
   "errMsg": "",
   "header": {
    "access-control-expose-headers": "Date,x-fc-request-id,x-fc-error-type,x-fc-code-checksum,x-fc-invocation-duration,x-fc-max-memory-usage,x-fc-log-result,x-fc-invocation-code-version"
    "content-disposition": "attachment"
    "content-length": "38"
    "content-type": "application/json"
    "date": "Sat, 25 Jun 2022 19:28:34 GMT"
    "x-fc-code-checksum": "92066386860027743"
    "x-fc-instance-id": "c-62b761c4-5a85e238b3ce404c817d"
    "x-fc-invocation-duration": "23"
    "x-fc-invocation-service-version": "LATEST"
    "x-fc-max-memory-usage": "66.61"
    "x-fc-request-id": "80854b93-b0c7-43ab-ab16-9ee9f77ff41e"
    "x-serverless-request-id": "ac1403831656185314624173902"
    "x-serverless-runtime-version": "1.2.2"
   }
   "requestId": "ac1403831656185314624173902"
   "result": {sum: 3}
   "success": true
  }
  ```
  
此时我们已经知道了前后端的基本交互,以下是关于后端代码的优化

### 问题及思路:
1. 后端针对前端的不同的请求运行不同的代码
    - 前端在data中设置一个type属性,后端接收后根据type判断要运行的代码块
2. 如果将多个功能的代码存在入口文件index.js中,那会造成代码冗余，可读性差，不易维护
    - 将不同功能的作为模块存在放入不同的文件中,再通过require引入,有效的解耦成不同模块也易于维护
2. 每个模块在使用时几乎都要传入相同的参数,重复工作,不易维护
    - 将引入的模块通过[type,module]形式存入Map对象中,使用时通过其自带的has方法判断是否有这个模块,再通过get获取并使用,这样自动根据type匹配相应的模块,参数也只用写一次
3. 每增加一个模块都需要在入口文件中引用,重复工作,有没有可能根据目录自动生成引入代码?
    - 通过node内置的`fs`模块读取所有模块的名字,并遍历为map添加所有模块
4. 业务错误时需要返回一段统一格式代码{success: false,errMsg: sting},重复工作，可维护性差,万一哪天格式变了岂不是每个模块都要查一遍?
    - 在模块使用的外部做个`try{}catch(e){}`捕获，模块内部统一使用throw new Error('无此数据')，抛出错误信息,由外部统一处理

    **文档结构**  
    
    ![](uni-cf_files/1.png)
    
    **关键代码**
```js
//index.js文件中
let fs = require('fs')
let path = require('path')
// 这里引入是path是因为不同系统中的使用的路径分隔符/或\不同,join会根据系统自动转换分隔符
let p = path.join(__dirname + '/apis')
// 获取当前目录下的apis目录下所有模块,返回为["login.js","test12.js"]
let apis = fs.readdirSync(p);
//遍历生成[type,module]Map集合
let funs = new Map()
apis.map(item => {
  let type = item.replace('.js', '')
  funs.set(type, require('./apis/' + item))
})

exports.main = async (event, cxt) => {
  //此处的event,对应的是前端传来的data对象,其中含有type属性,是为了鉴别请求类别,自行设置的
  let type = event.type
  // Map的has方法判断是否有这个type,成功就运行，失败就返回无此api
  if (funs.has(type)) {
    try {
      /* 此处做的捕获是为了统一处理各模块中抛出的错误，在模块中遇到业务逻辑问题，比如没有找到某个数据时可以手动抛出错误throw new Error('无此数据')，这里就会捕获变统一返回{success: false,errMsg:e.message}，可以避免重复在模块中书写相同格式的错误返回，且更易于维护*/
      let res = await funs.get(type)(event, cxt)
      // 此处用展开符,展开了返回
      return {success:true,...res}
    } catch (e) {
      return {
        success: false,
        errMsg: e.message,
      }
    }
  }
  return {
    success: false,
    errMsg: '无此api',
  }
};
```

以上代码复制黏贴到入口文件中,我们就有了一个可读性强,易于维护的后端代码块,而每个模块的实现就自行发挥了,接下来回到前端

## 路由守卫

**问题:** 如何在未登录的时候阻止用户访问其他页面?
  - 每次发生页面跳转的时候,拦截并判断用户是否满足跳转条件,这既是路由守卫

uni-id提供了一个现成的页面路由守卫方案,在page中为需要登录的页面配置`"needLogin"`属性,在进入这些页面时就会触发`needLogin事件`

1. 通过page.json配置各个页码`"needLogin"`属性
```json
{
"pages": [ //pages数组中第一项表示应用启动页
    {
      "path": "pages/Home/Home",
      "needLogin": false
    }, 
    {
      "path": "pages/Article/Article",
      "needLogin": true
    }
  ],
  "uniIdRouter": {
    "loginPage": "pages/Home/Home",
    "needLogin": [
      "pages/detail/.*"
    ],
    "resToLogin": true
  }
  }
```
- 此时访问Article就会触发`uniCloud.onNeedLogin`事件,如果我们不主动监听,uniapp就会拦截并返回`"loginPage"`也就是Home页面
- 特别注意,这个拦截是属于整套的uni-id方案的一部分,如果你用的是uni-id套餐,后续步骤就==不需要==看了,套餐中的uni-id-pages已经帮你实现了登录检验,登录成功就可以访问其他页面请点击,[详见](https://uniapp.dcloud.net.cn/uniCloud/uni-id-summary.html#uni-id-router)
- 如果不想用成套uni-id,只想用这个路由守卫功能,守卫就会一味拦截所有需要登录的页面跳转(即使已经登录),此时需要我们通过监听`onNeedLogin`事件取消默认的拦截行为,并通过为事件注册回调,自行实现状态检验,不合格的再跳转回登录页面,具体见下

2. 主动监听`uniCloud.onNeedLogin`事件,就会取消默认返回`"loginPage"`的行为
```js
//在app的onShow生命周期里注册,不是必须要在onShow里面注册,只要是在代码能被运行到的地方就行
   uniCloud.onNeedLogin((event) => {
     // 默认的返回行为被取消了手动返回,顺便做个提示,这部分都是自定义的
        uni.navigateTo({
          url: "/pages/Home/Home?needLogin=true",
        })
        uni.showToast({
          title: "请登录",
          icon: "none"
        })
      })
```
3. 获取当前账户状态
- uni-id模块中有一个api是现成的就是[`uniCloud.getCurrentUserInfo()`](https://uniapp.dcloud.net.cn/uniCloud/client-sdk.html#client-getcurrentuserinfo "获取用户信息")
- 注意使用这个api有个要求就是客户端必须将token存储在storage的`uni_id_token`内`uni.setStorageSync('uni_id_token', token)`

**api返回的参数**

|字段					|类型		|说明																	
|:-:					|:-:		|:-:																	
|uid					|Number	|当前用户uid													
|role					|Array	|用户角色列表。admin用户返回["admin"]	
|permission		|Array	|用户权限列表。注意admin角色此数组为空
|tokenExpired	|Number	|token过期时间												

到这里我们就能拦截住用户在没有登录时的访问行为,接下来就是怎么获取token了

## 用户状态管理

**问题:** 登录请求的时候,后端可以根据data中的账号密码信息查询到用户,登录完成后,其他请求不可能每次都带上账号,密码,这样不安全,而且每个请求都要查询用户数据库,性能消耗太大,成本太高,不现实,这种情况下后端要怎么知道是哪个用户在访问?
- 前后端约定的一段特殊加密的密文来判断是否登录,以及登陆人信息
- 实现逻辑:登录请求时后端查询一次用户数据库,验证账号密码,验证通过,就给前端返回一段密文,密文内容一般都是放这个账号的id,角色,权限信息,前端接收密文将其存入设备,后续每次请求都在data中加入这个密文,后端接收这个密文通过解密得到原来的值,也就是id,角色,权限,就不需要再查数据库了,直接根据这些信息计算这次请求结果并返回.
- 这里的密文就叫token
- 这样前端可以根据设备内的token知道用户是否登录,后端也能根据token内容判断是谁提出的请求
- token是一种主流判断身份的方法,其他方法自行百度

token加密一般用`json web token`简称jwt方法.  
这里可以自己导入使用jwt,使用不难,可以自行查询文档,uni-id管理token也是基于jwt实现的,直接拿来用也行

## 密码加密

**问题:** 前端登录发送的密码,如果再传送过程中被人截取,怎么办,存储再数据库中的密码被泄漏怎么办?
- 前端加密,后端存储加密后的密文,登陆时比对密文是否一致
- 加密分可逆和不可逆,即可以逆向还原和不可逆向还原
- 不可逆会导致,用户忘记密码的时候,连后台人员也不知道原密码,只能通过手机验证之类的重置.
- 可逆会导致,因为人大多数都习惯用一个密码,如果在你后台泄漏,用户会面临其他应用被盗号的情况,表现为下载了你的应用之后,其他应用老被盗号,老接到奇怪电话的现象.

本文采用不可逆的加密方法,百度了半天,决定使用[sha1](https://github.com/brix/crypto-js)

```js
//命令行下载npm i crypto-js
//项目用引入
import { SHA1 } from 'crypto-js';
// 使用
console.log(SHA1('j3jj').toString());
//打印:052891722d47b7c8aac0f07dc08f4f94d36f70d0
```


## database

### JQL中where字符串
正常使用是`'字段名=="字符串"'`,如果想在其中使用变量必须使用`` `username=='${acc}'` ``的形式,注意要在`${}`外加引号
```js
  let res = await dbJQL.collection('uni-id-users').where(`username==${acc}`).get();
  console.log('1', res.data)//获取失败,结果为[]
  res = await dbJQL.collection('uni-id-users').where('username==' + acc).get();
  console.log('2', res.data)//获取失败,结果为[]
  res = await dbJQL.collection('uni-id-users').where(`username=='${acc}'`).get();
  console.log('3', res.data)//获取成功,结果为object
```

![](uni-cf_files/1.jpg)

### 表结果Schema

用json表格配置数据库,各个字段的读写权限,填入格式

[**一级节点**](https://uniapp.dcloud.net.cn/uniCloud/schema.html#schema-root)

```json
{
	"bsonType": "object", // 固定节点
	"description": "表的描述",
	"required": [], // 必填字段
	"permission": { 
		"read": false, // 前端非admin的读取记录权限控制。默认值是false，即可以不写。可以简单的true/false，也可以写表达式
		"create": false, // 前端非admin的新增记录权限控制。默认值是false，即可以不写。可以简单的true/false，也可以写表达式 
		"update": false, // 前端非admin的更新记录权限控制。默认值是false，即可以不写。可以简单的true/false，也可以写表达式
		"delete": false, // 前端非admin的删除记录权限控制。默认值是false，即可以不写。可以简单的true/false，也可以写表达式
		"count": false // 前端非admin的求数权限控制。默认值是true，即可以不写。可以简单的true/false，也可以写表达式
	},
	"properties": { // 表的字段清单
		"_id": { // 字段名称，每个表都会带有_id字段
			"description": "ID，系统自动生成"
			// 这里还有很多字段属性可以设置
		}
	},
	"fieldRules":[
		// 字段之间的约束关系。比如字段开始时间小于字段结束时间。也可以只校验一个字段。支持表达式
	]
}
```



## 云存储
- 上传文件资料,前端调用`uniCloud.uploadFile`或使用`uni-file-picker`组件,直接上传至云存储,需配置相应的数据库表
```js
// 前端部分
uniCloud.uploadFile({
  filePath: filePath,
  cloudPath: 'a.jpg',
  onUploadProgress: function(progressEvent) {
    console.log(progressEvent);
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
  },
  success() {},
  fail() {},
  complete() {}
});
```
- 配置相应的数据库存储文件名和路径用于查询