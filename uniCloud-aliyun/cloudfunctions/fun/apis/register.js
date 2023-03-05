module.exports = async function login(event, context, dbJQL, user, uniIDIns) {
  let { acc, pwd } = event
  dbJQL.setUser({
    role: ['admin']
  })
  let res = await dbJQL.collection('uni-id-users').where(`username=='${acc}'`).count();
  // 判断是否存在
  if (res.code) {
    throw new Error(res.message)
  } else if (res.total) {
    throw new Error('账号已注册')
  }
  // 增加的结果
  let addRes = await dbJQL.collection('uni-id-users').add({
    "comment": "普通用户",
    "permission": [],
    "role_id": "user",
    "role_name": "普通用户"
  }, );
  if (addRes.code) throw new Error(addRes.code);
  //创建一个新token
  let { token, tokenExpired } = await uniIDIns.createToken({ uid, role })
  return { uid, role, token }
}
