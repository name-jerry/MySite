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
  let updateEnd = ref < boolean > (false)


  function confirm(tip: Tip): void {
    emit('update', tip)
    isActive.value = !isActive.value
  }

  function check(tip: Tip): void {
    updateEnd.value = true
    setTimeout(() => {
      tip.isEnd = !tip.isEnd
      emit('update', tip)
    }, 250)
  }
</script>

<template>
  <view class="input-wrap" :class="{ end: copy.isEnd,'update-end':updateEnd}">
    <checkbox :disabled="isActive" type="checkbox" class="check" :checked='copy.isEnd' @click="check(copy)" />
    <textarea :disabled="!isActive" auto-height :class="{'hover-shadow-input':isActive}" v-model="copy.title"
      class="input"></textarea>
    <button class="btn hover-shadow-btn" @click="confirm(copy)">
      {{ !isActive ?"编辑"  : copy.title?"确认":'删除'  }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .input-wrap.update-end {
    transition: .25s ease;
    transform: translateX(100%)
  }

  .input-wrap.update-end.end {
    transform: translateX(-100%)
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 16px;
    box-sizing: border-box;
    border-radius: 6px;
    transition: var(--transition-default);
    overflow: auto;

    .input {
      display: block;
      border-radius: 6px;
      line-height: 1.5;
      overflow: auto;
      background: transparent;
      font: inherit;
      color: black;
      text-indent: .5em;
      width: 0;
      flex: 1;
    }


    .btn {
      background-color: var(--color-bg-btn);
      color: white;
      border-radius: 6px;
      padding: 3px 8px;
      flex: none;
    }
  }
</style>
