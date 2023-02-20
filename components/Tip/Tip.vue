<script setup lang="ts">
  import { ref, reactive } from "vue";
  let emit = defineEmits < {
      (e: 'update', tip: Tip): void
    } >
    ()

  let { tip } = defineProps < { tip: Tip } > ();
  let copy = reactive < Tip > ({
    ...tip,
  });
  let isActive = ref < boolean > (false);

  function confirm(tip: Tip): void {
    emit('update', tip)
    console.log(copy)
    isActive.value = !isActive.value
  }

  function check(tip: Tip): void {
    tip.isEnd = !tip.isEnd
    emit('update', tip)
  }
</script>

<template>
  <view class="input-wrap" :class="{ active: isActive, end: copy.isEnd }">
    <checkbox :disabled="isActive" type="checkbox" class="check" :checked='copy.isEnd' @click="check(copy)" />
    <textarea :disabled="!isActive" auto-height :class="{'hover-shadow-input':isActive}" v-model="copy.title"
      class="input">不支持富文本</textarea>
    <button class="btn hover-shadow-btn" @click="confirm(copy)">
      {{ !isActive ?"编辑"  : copy.title?"确认":'删除'  }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: .5em 1em;
    box-sizing: border-box;
    border-radius: 8px;
    transition: var(--transition-1);
    overflow: hidden;


    .input {
      display: block;
      line-height: 1;
      background: transparent;
      font: inherit;
      color: black;
      text-indent: .5em;
      flex: 1;
    }


    .btn {
      color: var(--color-white);
      text-shadow: none;
      background-color: var(--color-1);
      border-radius: 4px;
      line-height: var(--lineHeight-2);
      padding: 0 .5em;
      flex: none;
    }
  }
</style>
