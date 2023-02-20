'use strict';
const db = uniCloud.database({ throwOnNotFound: false });
const jwt = require('jsonwebtoken');
const appId = 'wx360e08849e58a6ac';
const appSecret = 'c4856680bee609f6c6673f24372d55ae';
const jwtSecret = '测试用';
async function publish(event, auth) {
  delete event.data.token;
  let res = await db.collection('messageList').add({
    ...event.data,
    openId: auth.openId,
    publish: false
  });
  if (!res) throw new Error('添加失败')
}
async function getMessageList(event) {
  let res = await db.collection('messageList').get();
  return res.data
}
async function getMyMessageList(event, auth) {
  let res = await db.collection('messageList').where({ openId: auth.openId }).get();
  return res.data
}

async function login(event) {
  let res = await uniCloud.httpclient.request(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${event.data}&grant_type=authorization_code`, { dataType: 'json' }

  )
  let openId = res.data.openid;
  if (!openId) throw new Error('获取失败');
  let user = await db.collection('userList').doc(openId).get();
  let token = 'Bearer' + jwt.sign({ openId, ...user.data[0] }, jwtSecret);
  if (user.data[0]) {
    return {
      user: user.data[0],
      token
    }
  } else {
    let newUser = {
      _id: openId,
      createdAt: Date.now()
    }
    await db.collection('userList').add(newUser)
    return {
      user: newUser,
      token
    }
  }
}

async function updateUser(event, auth) {
  let user = event.data.user
  delete user._id
  return await db.collection('userList').doc(auth.openId).update({
    ...user
  });
}
const apis = new Map([
  ['publish', publish],
  ['getMessageList', getMessageList],
  ['login', login],
  ['getMyMessageList', getMyMessageList],
  ['updateUser', updateUser],
])
exports.main = async (event, context) => {
  try {
    let auth;
    if (event.api != 'login') {
      if (!event.data.token) {
        throw new Error('请先登录')
      } else {
        auth = jwt.verify(event.data.token.replace('Bearer', ''), jwtSecret)

      }
    }

    let data = await apis.get(event.api)(event, auth);
    return { success: true, data }
  } catch (error) {
    return { success: false, errorMessage: error.message }
  }

};
