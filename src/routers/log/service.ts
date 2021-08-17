import { Request } from 'express'
import BaseService from '../../util/service/BaseRestFulService'
import Log from './schema'
import { LogDocument } from './typings'
import filter from '../../util/filter'

export default class extends BaseService<LogDocument> {
  constructor() {
    super(Log)
  }

  save(req: Request, body: LogDocument): void {
    req.log.request_times = Date.now() - req.log.request_start_at
    req.log.request_status = req?.data?.status
    // 过滤掉敏感信息
    // 敏感字段在 config 文件夹下的配置文件中配置
    req.log.request_body = filter.body(req.body)
    this.create(Object.assign(body, req.log) as LogDocument)
  }
}
