export default function isValidObjectId(id: string): boolean {
  if (!id) {
    return false
  }
  id = id.toString()
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true
  } else {
    return false
  }
}
