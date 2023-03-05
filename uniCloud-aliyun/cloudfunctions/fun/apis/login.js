module.exports = async function login(event, context, dbJQL, user, uniIDIns) {
  let { acc, pwd } = event
  dbJQL.setUser({
    role: ['admin']
  })
  let res = await dbJQL.collection('uni-id-users').where(`username=='${acc}'`).get();
  // 判断是否存在
  if (res.code) {
    throw new Error(res.message)
  } else if (!res.data || !res.data.length) {
    throw new Error('未注册')
  }
  // 判断密码是否一致
  let { _id: uid, role, password } = res.data[0]
  if (password != pwd) {
    throw new Error('密码错误')
  }
  //创建一个新token
  let { token, tokenExpired } = await uniIDIns.createToken({ uid, role })
  return { uid, role, token }
}
