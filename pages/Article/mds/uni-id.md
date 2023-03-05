# uni-id


成套管理用户状态的系统,已实现:页面路由,界面,token,配置中心,公共模块,数据表,后台界面,其中各模块之间环环相扣,不能单独提取出来使用,封装度高,不宜修改,需要而外学习其中的框架,但可以省去大量的重复劳动.

## 模块摘要

|模块											|说明																													|
|:-:											|:-:																													|
|前端uni-app框架的相关API	|uniIdRouter页面路由、token管理客户端API											|
|前端页面uni-id-pages			|登录、注册、修改密码、忘记密码、个人中心、修改头像等前端页面	|
|网络传输自动管理用户token|自动保存、续期token、网络自动传输token												|
|云端云对象uni-id-co			|与uni-id-pages搭配的云对象，相关业务的云端部分								|
|云端配置uni-config-center|在uni-config-center下提供各种配置														|
|云端公共模块uni-id-common|用于云函数或云对象集成该模块验证token身份										|
|云数据库的用户相关数据表	|uni-id-users等各种opendb数据表																|
|uni-admin								|Admin管理后台，包括用户角色权限管理、注册用户统计						|

## 模块明细-==个人理解==

### uniCloud

- 项目中的uniCloud存储着所有云端相关的内容,云函数,云对象,公共模块,表结构
- ==其中common内的文件是对本地node\_modules文件下内容的引用及再排序==(右键在外部资源管理器打开可以发现对应同一个路径),node\_modules目录下嵌套复杂,所有云文件操作都建议在,项目根目录/uniCloud/cloudfunctions/目录下进行,==后续提到的common目录也都是这个目录==

### uni-id-common

- 一个功能的实现可分为可复用部分以及不可复用部分
- 公共模块即**可复用**部分,存放于common下
- **不可复用**部分作为云对象使用
- 官方的公共模块几乎都自带一个对应云对象,命名:模块名-co
- 个别云对象想引用公共模块
    1. 必须再目录处右键选择==管理公共模块==,选择想要引用的模块
    2. 再通过require的模式引用, commonjs 标准
- `uni-open-bridge-common`统一接管微信等三方平台认证凭据
- uni-id作为一个将管理token的部分单独提取出来放在common下的uni-id-common中^此处命名表示的是uni-id的公共部分,也是放在common中的^
*[commonjs]: nodejs引用模块的方式,云端函数的引用都是采用这个标准
```js
//公共模块
// common/hello-common/index.js
function getVersion() {
  return '0.0.1'
}
module.exports = {
  getVersion,
  secret: 'your secret'
}
```
```js
// use-common/index.js
'use strict';
const {
  secret,
  getVersion
} = require('hello-common')
exports.main = async (event, context) => {
  let version = getVersion()
  return {
    secret,
    version
  }
}
```
### uni-config-center

- uni将各个公共模块的config.json文件统一放再uni-config-center下管理
- 有些模块在引入的没有center中自动生成一个config,以uni-id为例,需要修改配置时需要手动创建一个,即在`/common/uni-config-center`下新建`/uni-id/config.json`

### uni-id-co

- 云对象,云函数的封装,使用时类似使用本地的 commonjs 模块~~可能是用起来像对象所以叫这个名字~~

```js
//云端
// 云对象名(文件名)：todo
module.exports = {
add(title, content) {
  title = title.trim()
  content = content.trim()
  if(!title || !content) {
    return {
      errCode: 'INVALID_TODO',
      errMsg: 'TODO标题或内容不可为空'
    }
  }
  // ...其他逻辑
  return {
    errCode: 0,
    errMsg: '创建成功'
  }
}
}
```
```js
//前端
const todo = uniCloud.importObject('todo') //第一步导入云对象
async function addTodo () {
try {
  const res = await todo.add('title demo', 'content demo') //导入云对象后就可以直接调用该对象的方法了，注意使用异步await
  uni.showToast({
    title: '创建成功'
  })
} catch (e) {
  // 符合uniCloud响应体规范 https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=resformat，自动抛出此错误 
  uni.showModal({
    title: '创建失败',
    content: e.errMsg,
    showCancel: false
  })
}
}
```
### 数据库

提供了几个角色相关opendb表
下载表格,database目录右键==新建DB Schema==选择以下几个表
|表名								|作用					
|:---:							|:---					
|uni-id-users				|用户表(主表)	用户个人信息,及所含有的角色等
|uni-id-permissions	|权限表,设置各类权限名称				
|uni-id-roles				|角色表,给角色配置权限表中不同的的权限				
|uni-id-log					|用户日志表,用户登录日志		
- uni-id基于经典的 RBAC 模型实现了角色权限系统。表现为 DB schema 配置各个数据读写权限是通过检查访问者的角色实现的(也可以通过检查权限)
*[RBAC]: Role-Based Access Control，基于角色的访问控制。
*[DB schema]: 表结构

### 前端API

- 比较常用的就是在page.json中设置路由守卫,为需要登录的界面增加一个跳转到登录页的功能,[详见](https://uniapp.dcloud.net.cn/uniCloud/uni-id-summary.html)

### uni-id-pages

- 官方封装好的几个常用功能页面,比如登录,注册等,以及其对应的后端云对象,具体用法看[文档](https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html)

### uni-admin

- 官方做的后台项目