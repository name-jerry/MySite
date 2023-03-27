import { Article } from "@/type"
/**
 * 传入一个文章对象，下载到本地
 * @param {Article} article - 文章对象
 * */
export function downloadArt(article : Article) {
  uni.showLoading({
    title: '生成文件中'
  })
  const fileContent = article.content;
  // 将字符串转换成 Blob 对象
  const blob = new Blob([fileContent], { type: "text/plain" });
  // 创建 URL 字符串
  const url = URL.createObjectURL(blob);
  // 创建 a 标签，设置 href 和 download 属性
  const link = document.createElement("a");
  link.href = url;
  link.download = article.title;
  // 将 a 标签添加到文档中并触发下载
  document.body.appendChild(link);
  link.click();
  // 清理临时 URL 对象
  URL.revokeObjectURL(url);
  link.remove()
  uni.hideLoading()
}