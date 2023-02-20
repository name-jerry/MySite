export async function cf(data: any): Promise<any> {
  uniCloud.callFunction({
    name: 'fun',
    data
  })
}