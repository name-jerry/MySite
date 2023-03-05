<template>
  <view class="item">
    <!--左侧img,右侧:badge,title,sub tags+time  -->
    <image :src="imgSrc" class="img" />
    <!-- 右侧-->
    <view class="right-warp">
      <!-- badge -->
      <navigator class="badge a">工作提示</navigator>
      <!-- 标题 -->
      <view class="h3  title hover-color">
        <navigator :url='url' class="lines a" style="--lines: 2">{{ title }}</navigator>
      </view>
      <!-- 简介 -->
      <view class="sub lines" style="--lines: 3">{{ sub }}</view>
      <!-- 底部标签 -->
      <view class="tags-warp">
        <!-- 遍历生成tags -->
        <view class="tags">
          <a href="#" class="hover-bg-color" v-for="(item, index) in tags" :key="index">#{{ item }}</a>
        </view>
        <view class="time"><text class="icon">&#xe60a;</text>{{ time }} 阅读</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  // 引入prop,就是刚刚的数据,用结构复制的方式直接获取对象
  let prop = defineProps<{
    postItem : PostItem
  }>();
  let { imgSrc, title, sub, tags, time, value } = prop.postItem
  let url = ref<string>('/pages/Article/Article?value=' + value)

  // 计算时间差
</script>

<style lang="scss" scoped>
  .item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    border-radius: 10px;

  }

  //左图
  .img {

    // flex使用数字的时候会覆盖width属性
    &:hover {
      transform: translateY(-2px);
    }

    flex: 0.7;
    // 设置长宽比
    aspect-ratio: 271 / 251;
    object-fit: cover;
    border-radius: 20px;
    transition: var(--transition-default);
  }

  .right-warp {
    flex: 1;

    .badge {
      padding: .2em .5em;
      border-radius: 30px;
      background: var(--color-bg-code);
      // 和原文字体不同才导致的视觉效果不同er
      font-weight: 700;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .h3 {
      margin-top: 16px;
    }

  }

  .tags-warp {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0px;
    justify-content: space-between;
    font-size: var(--fontSize-6);

    .tags {
      display: flex;
      gap: 8px;
    }

    .time {
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  @media (max-width: 575px) {
    .item {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
