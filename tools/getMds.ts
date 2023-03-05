export default async function getName() : Promise<string[]> {
  let { data } = await (uni.request({
    url: '/pages/Article/names.js'
  }) as unknown as Promise<any>)
  return data
}
