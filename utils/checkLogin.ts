function checkLogin() : boolean {
  let { tokenExpired } = uniCloud.getCurrentUserInfo();
  if (!tokenExpired || tokenExpired < Date.now()) {
    return false
  }
  return true
}
export { checkLogin }