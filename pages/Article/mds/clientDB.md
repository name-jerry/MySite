# clientDB


>[uniapp官网：传统的数据库操作只能在服务端实现，因为他在前端使用有安全问题。而uniCloud的云数据库有表结构(DB Schema)他通过简单的js表达式，配置了：各种角色权限的账号是否可以读取和写入某种规范的数据等，解决了在前端操作的安全问题；因此uniCloud的云数据库可以直接在前端调用。](https://uniapp.dcloud.net.cn/uniCloud/clientdb.html)

- uni允许客户端操作数据库,取名为[clientDB](https://uniapp.dcloud.net.cn/uniCloud/clientdb.html),
    1. 传统访问数据都是在后端进行的,前端是提出请求,后端完成验证后再查询数据返回给前端
    2. uni围绕 DB schema 进行了一系列的**权限审核**,再提供其他保护数据库安全的措施
- 用户需要的就是设计好 DB schema ,[详见](https://uniapp.dcloud.net.cn/uniCloud/schema.html#db-schema%E6%A6%82%E8%BF%B0)

*[DB schema]: 表结构,用于配置数据库中字段的访问权限及格式

## DB schema

配置数据库各项数据验证规则及读写权限,必须搭配JQL

### 表中变量

|变量名					|说明																																																															|
|:-:						|:-:																																																															|
|auth.uid				|用户id																																																														|
|auth.role			|用户角色数组，参考uni-id 角色权限，注意admin为内置的角色，如果用户角色列表里包含admin则认为此用户有完全数据访问权限							|
|auth.permission|用户权限数组，参考uni-id 角色权限																																																|
|doc						|数据库中的目标数据记录，用于匹配记录内容/查询条件																																								|
|now						|当前服务器时间戳（单位：毫秒），时间戳可以进行额外运算，如doc.publish_date > now - 60000表示publish_date在最近一分钟							|
|action					|数据操作请求同时指定的uni-clientDB-action。用于指定前端的数据操作必须同时附带执行一个action云函数，如未触发该action则权限验证失败|



