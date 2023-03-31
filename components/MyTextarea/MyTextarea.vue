<template>
  <div class="textarea-wrap">
    <div class='copyDiv' ref="copyDiv"></div>
    <component is='textarea' ref="textarea" class="textarea" @compositionstart='isComposing=true'
      @compositionend='compositionend' :value="prop.text" @input="areaInput">
    </component>
    <ul class="prompt" ref="prompt">
      <li v-for="item in promptList" :data-sub='item.sub' :key="item.label">
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import { generatePrompt } from "@/pojos/generatePrompt"
  import type { Prompt } from "@/pojos/generatePrompt"
  import { debounce } from "@/utils/debounce"
  import { useEventListener } from "@/utils/event"
  const prop = defineProps<{ text : any }>();
  const emit = defineEmits<{ (e : "update", text : String) : void }>()
  /**联想代码数组*/
  const promptList = ref<Prompt[]>()
  const textarea = ref<HTMLTextAreaElement>()
  const copyDiv = ref<HTMLDivElement>()
  const prompt = ref<HTMLUListElement>()
  /*中文是否处于拼写状态*/
  const isComposing = ref<boolean>(false);
  const debounceInput = debounce(input, 200)
  useEventListener(window, 'click', hiddenPrompt)
  useEventListener(window, 'keydown', keydown)
  onMounted(() => {
    watch(() => prop.text, autoHeight, { immediate: true })
  })
  let keydownFns = new Map<string, (e : KeyboardEvent, area : HTMLTextAreaElement) => void>()
  keydownFns.set('Tab', enterPromt)
  keydownFns.set('Escape', hiddenPrompt)
  keydownFns.set('BracketLeft', (e, area) => {
    let keys = e.shiftKey ? ["{", "}"] : ["[", "]"];
    doubleKey(e, area, keys)
  })
  keydownFns.set('Digit9', (e, area) => {
    let keys = e.shiftKey ? ["(", ")"] : ['9', '']
    doubleKey(e, area, keys)
  })
  keydownFns.set('Quote', (e, area) => {
    let keys = e.shiftKey ? ['"', '"'] : ["'", "'"];
    doubleKey(e, area, keys)
  })
  /**监听键盘事件，点击tab时输入联想的代码*/
  function keydown(e) {
    const area = textarea.value
    const c = e.code
    if (!keydownFns.has(c)) return;
    e.preventDefault();
    keydownFns.get(c)(e, area)
  }
  function doubleKey(e : KeyboardEvent, area : HTMLTextAreaElement, keys : string[]) {
    let start = area.selectionStart;
    let end = area.selectionEnd;
    let text = area.value
    let str1 = text.slice(0, start)
    let str2 = text.slice(start, end)
    let str3 = text.slice(end)
    area.value = str1 + keys[0] + str2 + keys[1] + str3
    let add = keys[1] ? 2 : 1
    area.selectionEnd = end + add
  }
  /**利用div自动增高的特点，为其赋值，areatext通过css设置成同div高度*/
  function autoHeight() {
    copyDiv.value.textContent = prop.text;
  }
  /**输入联想到的第一段代码*/
  function enterPromt() {
    let area = textarea.value;
    let start = area.selectionStart;
    let str1 = area.value.slice(0, start);
    let str2 = area.value.slice(start);
    if (!isShowPromt()) {
      str1 += "  "
      start = str1.length;
    } else {
      let p = promptList.value[0]
      // 匹配到的第一个字符串
      let l1 = p.exec[0].length;
      let l2 = p.code.length
      str1 = str1.slice(0, -l1);
      str1 += p.code
      start = str1.length - l2 + p.lastIndex;
    };
    area.value = str1 + str2;
    area.selectionStart = start
    area.selectionEnd = start
    area.dispatchEvent(new Event('input'))
  }
  function input() {
    // 中文处于拼音状态时不输入
    if (isComposing.value) return;
    let area = textarea.value;
    let beforeString = getCursorBeforeString(area)
    let a = generatePrompt(beforeString)
    promptList.value = a;
    if (a?.length) showPrompt();
    updatePromptByCursorPosition(area)
    emit('update', area.value);
  };
  /**
   * 根据输入光标坐标更新联想框的位置
   * @param {HTMLTextAreaElement} area - textArea元素  
   */
  function updatePromptByCursorPosition(area : HTMLTextAreaElement) {
    let { x, y } = getCursorPosition(area)
    prompt.value.style.left = x + "px";
    prompt.value.style.top = y + "px";
  }
  function hiddenPrompt() {
    prompt.value.style.display = 'none'
  }
  function showPrompt() {
    prompt.value.style.display = 'block'
  }
  function isShowPromt() {
    return prompt.value.style.display == 'block'
  }
  function areaInput() {
    debounceInput();
    hiddenPrompt()
  }
  function compositionend(e : CompositionEvent) {
    isComposing.value = false;
    e.target.dispatchEvent(new Event('input'))
  }
  /**
   * 获取输入光标前的字符串
   * @param  {HTMLTextAreaElement} area - textarea元素
   * @return {string} 光标前面的字符串
  */
  function getCursorBeforeString(area : HTMLTextAreaElement) : string {
    let start = area.selectionStart;
    let str1 = area.value.slice(0, start)
    return str1
  }
  /**
   *@param {HTMLTextAreaElement} area - textarea元素;
   *@return { {x : number, y : number} } 元素中光标的坐标{x,y};
  */
  function getCursorPosition(area : HTMLTextAreaElement) : { x : number, y : number } {
    let start = area.selectionStart;
    let value = area.value
    let str1 = value.slice(0, start)
    let str2 = value.slice(start)
    let textNode1 = document.createTextNode(str1)
    let textNode2 = document.createTextNode(str2)
    let cursor = document.createElement('span')
    cursor.innerHTML = '&nbsp'
    const div = copyDiv.value;
    div.innerHTML = ''
    div.appendChild(textNode1)
    div.appendChild(cursor)
    div.appendChild(textNode2)
    return { x: cursor.offsetLeft, y: cursor.offsetTop + cursor.offsetHeight }
  }
</script>

<style scoped lang="scss">
  .textarea-wrap {
    position: relative;

    .textarea,
    .copyDiv {
      white-space: pre-wrap;
      word-break: break-all;
      font: inherit;
      line-height: inherit;
      background: inherit;
      color: inherit;
      border: none;
      outline: none;
      box-sizing: border-box;
      padding: 0;
      overflow: hidden;
    }

    .textarea {
      resize: none;
      position: absolute;
      padding: inherit;
      inset: 0;
    }

    .copyDiv {
      padding: 0;
      visibility: hidden;
    }


    .btn {
      position: fixed;
      top: 20%;
      right: 40px;
      z-index: 10;
    }


    .prompt {
      position: absolute;
      top: 100px;
      left: 40px;
      list-style-type: decimal;
      padding-left: 0;
      list-style-position: inside;

      &,
      li::before {
        border: 1px solid;
        border-color: hsl(0, 0%, 90%) hsl(0, 0%, 80%) hsl(0, 0%, 80%) hsl(0, 0%, 90%);
        border-radius: 8px;
        background: linear-gradient(145deg, hsl(0, 0%, 90%), hsl(0, 0%, 98%) 50%, hsl(0, 0%, 80%));
      }




      li {
        padding: .25em .5em;
        box-shadow: inherit;
        cursor: pointer;

        &::before {
          content: attr(data-sub);
          position: absolute;
          left: calc(100% + 2px);
          top: 0;
          white-space: pre;
          min-width: 100%;
          min-height: 100%;
        }
      }



    }
  }
</style>