# 项目接口及数据字典


## 接口
### 请求

|属性名	|类型			|说明														|
|:---:	|:---:		|:---:													|
|type		|string		|用于后端区分调用模块比如'login'|
|token?	|string		|令牌														|
|...		|undefine	|其他属性												|
### 回应
|属性名	|类型			|说明															|
|:---:	|:---:		|:---:														|
|success|boolean	|业务层面是否成功,true时errCode为0|
|errCode|string\|0				|错误码,内容同errMsg,为了配合uni-id部分功能,故增加这个属性,成功为0|
|errMsg	|string		|错误提示													|
|token	|string		|令牌															|
|...		|undefine	|其他返回													|

## 数据库字典

### 摘要
|数据库名字						|说明			|
|:----:								|:---:		|
|uni-id-users					|用户表		|
|opendb-news-articles	|文章			|
|opendb-verify-codes	|验证码		|
|uni-id-log						|登录记录	|
|uni-id-permissions		|权限			|
|uni-id-roles					|角色			|


### uni-id-roles
<details>

```json
{
        "comment": "超级管理员拥有所有权限",
        "permission": [
        ],
        "role_id": "admin",
        "role_name": "超级管理员"
    },
```
</details>

### uni-id-roles  

<details>

```json
{
        "comment": "超级管理员拥有所有权限",
        "permission": [
        ],
        "role_id": "admin",
        "role_name": "超级管理员"
    },
```
</details>

### JQL接口

JQL返回格式,[详见](https://uniapp.dcloud.net.cn/uniCloud/jql.html#returnvalue)


|属性名		|类型			  |说明						
|:---:		|:---:		  |:---:					
|cod			|string\|0	|成功为0				
|message	|string		  |提示						
|systemInfo|array		  |								
|affectedDocs|number	|返回个数最大值100
|total?		|number		  |count()命令或get({getCount:true})时返回,符合条件的总数,不受100限制
|data?		|object[]		|get()命令返回,错误时无返回


