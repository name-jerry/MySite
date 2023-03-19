function checkLogin() : Boolean {
  let { tokenExpired } = uniCloud.getCurrentUserInfo();
  if (!tokenExpired || tokenExpired < Date.now()) {
    return false
  }
  return true
}
export { checkLogin }
