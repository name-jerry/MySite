type Prompt = { label : string, sub : string, code : string, exec ?: string[], lastIndex : number };

function getPromptMap() {
  let promptMap = new Map<RegExp, Prompt>()
  promptMap.set(/code$/g, { label: 'code', sub: '代码块', code: "```\n```", lastIndex: 3 })
  promptMap.set(/table(\d{1,2})\*(\d{1,2})$/g, { label: 'table', sub: '列表', code: "", lastIndex: 1 })
  promptMap.set(/a$/g, { label: 'a', sub: '链接[标题](链接)', code: "[]()", lastIndex: 1 })
  return promptMap
}


export { getPromptMap, Prompt }