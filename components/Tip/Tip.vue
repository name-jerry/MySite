<template>
  <view class="input-wrap" :class="{ end: copy.is_end,'update-end':updateEnd,remove:isRemove}">
    <checkbox type="checkbox" class="check" :checked='copy.is_end' @click="check" />
    <textarea auto-height :class="{'hover-shadow-input':isActive}" @focus="isActive= true" @blur="blur"
      v-model="copy.title" class="input"></textarea>
    <view v-show="isActive" class="remove-btn" @tap="remove"></view>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive } from "vue";
  import type { Tip } from "@/type";
  let emit = defineEmits<{
    (e : "update", tip : Tip) : void
    (e : "remove", tip : Tip) : void
  }>()

  let prop = defineProps<{ tip : Tip }>();
  let copy = reactive<Tip>({
    ...prop.tip,
  });
  let isActive = ref<boolean>(false);
  let updateEnd = ref<boolean>(false)
  let isRemove = ref<boolean>(false)
  // 失焦
  function blur() {
    if (!copy.title) { isRemove.value = true }
    setTimeout(() => {
      isActive.value = !isActive.value;
      emit('update', copy);
    }, 300)
  }
  function remove() {
    copy.title = '';
    isRemove.value = true
  }
  function check() : void {
    updateEnd.value = true
    setTimeout(() => {
      copy.is_end = !copy.is_end;
      copy.end_date = copy.is_end ? Date.now() : null;
      emit('update', copy);
    }, 300)
  }
</script>



<style lang="scss" scoped>
  .input-wrap.update-end {
    transform: translateX(100%);
  }

  .input-wrap.update-end.end {
    transform: translateX(-100%);

  }

  .remove {
    transform: scaleY(0%);
    opacity: 0;
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
    transition: .3s linear;
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
      max-height: 3em;
    }

    .remove-btn {
      background-color: rgba(0, 0, 0, .2);
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        position: absolute;
        height: 60%;
        width: 2px;
        background-color: white;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::before {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
</style>