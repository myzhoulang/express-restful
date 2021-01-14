import upyun from 'upyun'

let client
export function upload() {
  const bucket = new upyun.Bucket('sixapp-ant', 'wenniao', 'z0JlxR4XmZVieVZPaGyAduPx5r9kUfJf')
  client = new upyun.Client(bucket)
  client.listDir('/auth').then((data) => {
    console.log(data)
  })
}

export function putFile(localFile) {
  return client.putFile('/auth/a.png', localFile)
}
