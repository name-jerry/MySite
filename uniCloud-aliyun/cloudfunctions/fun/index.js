'use strict';
const uniID = require('uni-id-common')
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

exports.main = async (event, context) => {
  //配置uni-id-common用于管理token
  const { type } = event
  const uniIDIns = uniID.createInstance({
    context
  })
  let { errCode, errMsg, uid, token, role, permission } = await uniIDIns.checkToken(event.token)
  // 非登录注册请求,token出错都终止
  if (errCode && type != 'login' && type != 'register') {
    return {
      success: false,
      errCode,
      errMsg,
    }
  }
  // 获取JQL数据库操作对象
  const dbJQL = uniCloud.databaseForJQL({ event, context });
  if (funs.has(type)) {
    try {
      // 传入原有的两个属性,dbJQL操作对象,token中含有的角色信息,uni-id-common模块
      let res = await funs.get(type)(event, context, dbJQL, { uid, role, permission }, uniIDIns)
      // 此处利用用展开符的特性,遇到登录接口等返回的res中含有token属性将覆盖此处的token
      return { success: true, errCode: 0, token, ...res }
    } catch (e) {
      return {
        success: false,
        errCode: e.message,
        errMsg: e.message,
      }
    }
  }
  return {
    success: false,
    errCode: '无此api',
    errMsg: '无此api',
  }
};
