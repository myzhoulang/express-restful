import { ObjectId, Document, Model, Query } from 'mongoose'

export interface ILog {
  user_id?: ObjectId
  user_name?: string
  request_url: string
  request_id: string
  request_method: HttpMethods
  request_body: string
  request_times: number
  request_status: HttpStatusCode
  system?: string
}

export interface LogDocument extends ILog, Document {}

export interface LogModel extends Model<LogDocument> {
  getByTime(this: Model<LogDocument>, time: number): Query<LogDocument[], LogDocument>
}
