<template>
  <view class="recent">
    <!-- 左右两部分,左边内容是标题,摘要,卡片组,按钮组;右边部分分为三块,都差不多就是一堆itemList -->
    <!-- 左边容器 -->
    <view class="left-wrap">
      <text class="title h2">最新文章</text>
      <text class="sub">不要错过最新的咨询</text>
      <view class="wrap">
        <!-- 卡片组 -->
        <view class="content">
          <!-- 卡片组件 -->
          <RecentCard class="recent-card" v-for="(item, index) in postList" :key="index" :post-item='item' />
        </view>
        <!-- 分页器,自制组件 -->
        <view class="pages">
          <!-- 做个分页器 -->
          <!-- <Pages class="pages" :current="pages.current" :max="pages.max" :show="pages.show" @pages-click="pagesClick" /> -->
        </view>
      </view>
    </view>
    <!-- 右边容器 -->
    <view class="right-wrap">
      <!-- 第一个卡片组 -->
      <view class="one card">
        <text class="title h3">热门帖子</text>
        <PopularCard v-for="(item, index) in popularList" :key="index" :img-src="item.imgSrc" :title="item.title"
          :time="item.time" />
      </view>
      <!-- 第二个卡片组 -->
      <view class="two card">
        <text class="title h3">最新评论</text>
        <template v-for="(item, index) in commentList">
          <!-- 上sub,下head+view>title+time -->
          <view class="two-wrap">
            <text class="two-sub">{{ item.sub }}</text>
            <view class="two-bottom">
              <image :src="item.imgSrc" alt="" class="img" />
              <view class="head-content">
                <view class="two-title">{{ item.title }}</view>
                <view class="time">{{ item.time }}</view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <!-- 第三个卡片组 -->
      <view class="three card">
        <image class="logo" src="@/static/img/logo.svg" />
        <text class="three-sub h3">Follow us on instagram</text>
        <view class="three-content">
          <a class="a" href="#" v-for="(item, index) in instaList">
            <image class="img" :src="item" />
          </a>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { reactive } from "vue";
  import names from '../Article/names.js';

  let postList = reactive<PostItem[]>([]);
  names.map((item : string) => {
    postList.push({
      imgSrc: "",
      title: item.replace('.md', ''),
      sub: "",
      tags: [item],
      time: '',
      value: item
    })
  })
  // 当前页,最大页,最大显示页
  let pages = reactive({
    current: 1,
    max: 10,
    show: 4,
  });

  function pagesClick(n) {
    if (typeof n == "number") {
      pages.current = n;
    } else if (n == "left") {
      pages.current -= 1;
    } else if (n == "right") {
      pages.current += 1;
    }
  }
  // 右侧第一个卡片组
  let popularList = reactive([{
    imgSrc: "",
    title: "Creating is a privilege but it’s also a gift",
    time: "15 mins read 15 April 2022",
  }
  ]);
  let commentList = reactive([{
    sub: "“ Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner “ ",
    imgSrc: "",
    title: "Jane Cooper",
    time: "15 April 2022",
  }
  ]);
  // three
  let instaList = reactive([
  ]);
</script>

<style lang="scss" scoped>
  .recent {
    display: flex;
    gap: 50px;
    background-color: var(--color-bg-pre);
  }

  // 左侧容器
  .left-wrap {
    // 布局时1比0.6
    flex: 1;

    .title {
      font-size: var(--fontSize-2);
      margin-bottom: 10px;
      background-image: var(--gradient-2);
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }

    .sub {
      margin-bottom: 70px;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  // 右侧容器
  .right-wrap {
    flex: 0.6;
    display: flex;
    flex-direction: column;
    gap: 30px;

    .one,
    .two,
    .three {
      border-radius: 12px;
      background-color: var(--color-bg-code);
      padding: 24px;
      border: 1px solid var(--color-border-default);
    }

    .title {
      display: inline-block;
      background-image: var(--gradient-2);
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      font-size: var(--fontSize-3);

      &::after {
        display: block;
        content: "";
        margin-top: 10px;
        height: 3px;
        width: 100px;
        background-color: var(--bg-carolina-blue);
      }
    }
  }

  .two {
    .two-wrap {
      padding-block-end: 22px;
      border-block-end: 1px solid var(--border-prussian-blue);
      margin-block-end: 22px;
    }

    .two-sub {
      margin-block-end: 20px;
      font-size: var(--fontSize-6);
      line-height: var(--lineHeight-1);
      color: var(--text-wild-blue-yonder);
    }

    .img {
      border-radius: 50%;
      aspect-ratio: 1/1;
      object-fit: cover;
      width: 32px;
      height: 32px;
    }

    .two-bottom {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: var(--fontSize-6);

      .time {
        font-size: var(--fontSize-7);
      }
    }
  }

  .three {
    .logo {
      width: 119px;
      height: 37px;
      background-size: contain;
    }

    .three-sub {
      font-weight: bold;
    }

    .three-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      .a {
        width: 100%;
        border-radius: 6px;
        overflow: hidden;
        aspect-ratio: 1 / 1;

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  @media (max-width: 992px) {
    .recent {
      flex-direction: column;
    }
  }
</style>
