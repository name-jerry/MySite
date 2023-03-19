<template>
  <div class="textarea-wrap">
    <div class='copy' ref="copy"></div>
    <component is='textarea' ref="textarea" class="textarea" :value="copyText" @input="input">
    </component>
    <div class="prompt" ref="prompt"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue';
  let prop = defineProps<{
    text : any
  }>();
  let copyText = ref('')

  const emit = defineEmits<{ (e : "update", text : String) : void }>()
  // 提示位置
  let textarea = ref()
  let copy = ref()
  let prompt = ref()

  function test() {
    if (copy.value.style.visibility == 'hidden') {
      copy.value.style.visibility = 'initial';
      textarea.value.style.visibility = 'hidden'
    } else {
      copy.value.style.visibility = 'hidden';
      textarea.value.style.visibility = 'initial'
    }
  }
  async function input() {
    let area = textarea.value
    area.style.height = `auto`
    await nextTick()
    area.style.height = `${area.scrollHeight}px`
    copyText.value = area.value;
    let { x, y } = getCursorPosition(area)
    prompt.value.style.left = x + "px";
    prompt.value.style.top = y + "px";
    emit('update', copyText.value);
  };
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
    copy.value.innerHTML = ''
    copy.value.appendChild(textNode1)
    copy.value.appendChild(cursor)
    return { x: cursor.offsetLeft, y: cursor.offsetTop + cursor.offsetHeight }
  }
  onMounted(() => {
    watch(() => prop.text, () => { copyText.value = prop.text; input() }, { immediate: true })
  })
</script>

<style scoped lang="scss">
  .textarea-wrap {
    position: relative;

    .textarea,
    .copy {
      white-space: pre-wrap;
      word-break: break-all;
      font: inherit;
      line-height: inherit;
      background: inherit;
      color: inherit;
      padding: 0;
      border: none;
      outline: none;
    }

    .textarea {
      width: 100%;
      height: auto;
      min-height: 50px;
      resize: none;
    }

    .copy {
      position: absolute;
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
      width: 40px;
      height: 40px;
      background-color: hsla(0, 0%, 0%, .2);
      backdrop-filter: blur(1px);
    }
  }
</style>