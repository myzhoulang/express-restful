import upyun from 'upyun'

let client
export function upload() {
  const { OSS_BUCKET, OSS_USER, OSS_PASSWORD } = process.env
  const bucket = new upyun.Bucket(OSS_BUCKET, OSS_USER, OSS_PASSWORD)
  client = new upyun.Client(bucket)
  client.listDir('/auth').then((data) => {
    console.log(data)
  })
}

export function putFile(fileName, localFile) {
  return client.putFile(fileName, localFile)
}

export function getFile(fileName) {
  return client.getFile(fileName)
}
