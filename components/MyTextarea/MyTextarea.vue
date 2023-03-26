<template>
  <div class="textarea-wrap">
    <div class='copyDiv' ref="copyDiv"></div>
    <component is='textarea' ref="textarea" class="textarea" @compositionstart='isComposing=true'
      @compositionend='compositionend' :value="copyText" @input="areaInput">
    </component>
    <ul class="prompt" ref="prompt">
      <li v-for="item in promptList" :data-sub='item.sub' :key="item.label">
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
  import { generatePrompt } from "@/pojos/generatePrompt"
  import type { Prompt } from "@/pojos/generatePrompt"
  import { debounce } from "@/utils/debounce"
  let prop = defineProps<{
    text : any
  }>();
  let copyText = ref('')
  let promptList = ref<Prompt[]>()

  const emit = defineEmits<{ (e : "update", text : String) : void }>()
  // 提示位置
  let textarea = ref()
  let copyDiv = ref()
  let prompt = ref()
  let isComposing = ref<boolean>(false);
  async function autoHeight() {
    let area = textarea.value
    area.style.height = `auto`
    await nextTick()
    area.style.height = `${area.scrollHeight}px`
  }
  let debounceInput = debounce(input, 200)
  function input() {
    if (isComposing.value) return;
    let area = textarea.value;
    copyText.value = area.value;
    let { x, y } = getCursorPosition(area)
    let beforeString = getCursorBeforeString(area)
    let a = generatePrompt(beforeString)
    promptList.value = a;
    if (a?.length) showPrompt();
    prompt.value.style.left = x + "px";
    prompt.value.style.top = y + "px";
    emit('update', copyText.value);
  };
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
    let textNode1 = document.createTextNode(str1)
    let cursor = document.createElement('span')
    cursor.innerHTML = '&nbsp'
    copyDiv.value.innerHTML = ''
    copyDiv.value.appendChild(textNode1)
    copyDiv.value.appendChild(cursor)
    return { x: cursor.offsetLeft, y: cursor.offsetTop + cursor.offsetHeight }
  }
  onMounted(() => {
    window.addEventListener('click', hiddenPrompt);
    window.addEventListener('keydown', (e) => {
      if (e.key == "Tab") {
        e.preventDefault();
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
    })
    watch(() => prop.text, () => { copyText.value = prop.text; autoHeight() }, { immediate: true })
  })
  onUnmounted(() => {
    window.removeEventListener('click', hiddenPrompt)
  })
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
      width: 100%;
      height: auto;
      min-height: 50px;
      resize: none;
    }

    .copyDiv {
      position: absolute;
      padding: inherit;
      inset: 0;
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
      top: 40px;
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
          width: 100%;
          min-height: 100%;
        }
      }



    }
  }
</style>