<template>
  <div class="card-wrap">
    <a :href="item.href" class="card" :style="{ 'background-image': 'url(' + item?.imgUrl + ')' }">
      <div class="text-content">
        <h3 class="title">{{ item?.title }}</h3>
        <p class="sub">{{ item?.sub }}</p>
      </div>
    </a>
  </div>
</template>

<script setup>
  let { item } = defineProps({
    item: Object,
  });
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50%;
    border-radius: inherit;
    overflow: hidden;
    width: 100%;
    height: 100%;

    &:hover .text-content .title {
      color: var(--color-font-title);
    }


    .text-content {
      position: absolute;
      bottom: 15px;
      left: 15px;

      .title {
        color: var(--color-font-title);
        font-weight: bold;
        margin-bottom: 5px;
      }

      .sub {
        font-size: var(--fontSize-default);
      }
    }
  }
</style>