<template>
  <view class="wrap">
    <!-- 左侧img右侧title+time -->
    <image :src="imgSrc" class="img" />
    <view class="right">
      <text class="h4 title hover-1">
        <a href="">{{ title }}</a>
      </text>
      <view class="time">{{ time }}</view>
    </view>
  </view>
</template>

<script setup>
  // 引入资源
  let { imgSrc, title, time } = defineProps(["imgSrc", "title", "time"]);
</script>

<style lang="scss" scoped>
  .wrap {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .img {
    flex: none;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
  }

  .title {
    flex: 1;
    color: var(--text-columbia-blue);
  }

  .time {
    font-size: var(--fontSize-6);
    color: var(--text-slate-gray);
    margin-top: 12px;
    margin-bottom: 20px;
  }
</style>
