export default async function getMdFileNames() : Promise<string[]> {
  let { data } = await (uni.request({
    url: '@/ignore/names'
  }) as unknown as Promise<any>)
  return data
}