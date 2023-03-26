import { reactive } from "vue";
import type { SwipeItem } from '@/type';

export let swipeItemList = reactive<SwipeItem[]>([{
  imgUrl: "/static/img/topic-1.png",
  title: "快递系统-用户端",
  sub: "后端已关闭",
  href: "https://zhangruisite.com/expressage",
}, {
  imgUrl: "/static/img/topic-2.png",
  title: "快递系统-后台",
  sub: "后端已关闭",
  href: "https://zhangruisite.com/expressage-admin",
},
{
  imgUrl: "/static/img/topic-5.png",
  title: "烟花",
  sub: "祝大家新年快乐",
  href: "/fire",
},
{
  imgUrl: "/static/img/topic-3.png",
  title: "canvas小游戏",
  sub: "每个少年都有一个坦克大战的梦,开发中...",
  href: "https://zhangruisite.com/tank",
},
{
  imgUrl: "/static/img/demo1.bmp",
  title: "demo1",
  sub: "一个简单的网页",
  href: "https://zhangruisite.com/demo1",
},
{
  imgUrl: "/static/img/mySite.jpeg",
  title: "个人网站1.0",
  sub: "vue版",
  href: "https://zhangruisite.com/MySiteVue/",
},
]);