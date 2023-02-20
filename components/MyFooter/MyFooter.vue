<script></script>

<template>
  <view class="footer light">
    <text class="text"> Copyright ©2023-2023 zhangruisite.com All Rights Reserved. </text>
    <view class="info">
      <a class="a" href="https://beian.miit.gov.cn/" target="_blank">
        浙ICP备2022037162号-1
      </a>
      <a class="a" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33038102332258">
        <img class="img" src="@/static/img/beian.png" />
        <text>浙公网安备 33038102332258号</text>
      </a>
    </view>
  </view>
</template>


<style>
  .footer {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0;
    line-height: 20px;
    font-size: 13px;
    gap: 0px 10px;
    place-content: center;
  }

  .img {
    width: 20px;
    height: 20px;
  }


  .info {
    display: flex;
    color: #939393;
    text-decoration: none;
    gap: inherit;
  }

  .a {
    display: flex;
  }

  @media (max-width: 1200px) {}

  @media (max-width: 992px) {}

  @media (max-width: 768px) {}

  @media (max-width: 575px) {}
</style>
