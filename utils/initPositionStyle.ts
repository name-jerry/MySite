interface Position {
  left?: string; right?: string; bottom?: string; top?: string
}
/** 
 *根据位置信息重置样式 
@param{ClientInfo}info 组件位置信息
@param{Position}position 组件样式变量
*/
function initPositionStyle(info: ClientInfo, position: Position): void {
  let { clientLeft: l, clientRight: r, clientTop: t, clientBottom: b } = info
  if (l > r) {
    position.right = '101%'
    position.left = 'initial'
  } else {
    position.right = 'initial'
    position.left = '101%'
  }
  if (t > b) {
    position.bottom = '-10px'
    position.top = 'initial'
  } else {
    position.top = '-10px'
    position.bottom = 'initial'
  }
}
export { initPositionStyle, Position }