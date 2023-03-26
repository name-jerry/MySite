import { getPromptMap } from "./promptData"
import type { Prompt } from "./promptData"
/**
 * 根据前面输入的字符匹配联想代码数组
 * @param {string} beforeString - 光标前面的字符串
 * @return {string} 根据字符串返回联想到的代码片段数组
 */
let fns = new Map()
fns.set('table', (e : RegExpExecArray) => {
  let rows : number = +e[1];
  let columns : number = +e[2];
  let res : string = ''
  for (let r = 0; r <= rows; r++) {
    if (r) res += '\n';
    for (var c = 0; c <= columns; c++) {
      res += r == 1 && c != columns ? "|:--:" : "|    "
    }
  }
  res += '\n'
  return res
})

function generatePrompt(beforeString : string) : Prompt[] {
  // 获取新光标前的5个字母
  let str = beforeString.slice(-10);
  let arr : Prompt[] = [];
  [...getPromptMap()].map(([key, value]) => {
    if (!key.test(str)) return;
    let label = value.label;
    key.lastIndex = 0;
    let e = key.exec(str);
    value.exec = e;
    fns.has(label) && (value.code = fns.get(label)(e));
    arr.push(value);
    return;
  }
  )
  if (!arr?.length) return;
  let resArr = arr.flat()
    .filter((val) => {
      return val?.label;
    }) as Prompt[]
  return resArr
}
export { generatePrompt, Prompt }