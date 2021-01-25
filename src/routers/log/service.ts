import BaseService from '../../util/BaseService'
import Log from './schema'
import { LogDocument } from './typings'

export default class extends BaseService<LogDocument> {
  constructor() {
    super(Log)
  }
}
