import { ObjectId, Document, Model, Query } from 'mongoose'
// http 方法
export enum HttpMethods {
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
}

export interface ILog {
  user_id?: ObjectId
  user_name?: string
  request_url: string
  request_id: string
  request_method: HttpMethods
  request_body: string
  request_times: number
  request_status: number
  system?: string
}

export interface LogDocument extends ILog, Document {}

export interface LogModelConstructor extends Model<LogDocument> {
  getByAction(this: Model<LogDocument>, action: string): Query<LogDocument[], LogDocument>
  getByRequestIp(this: Model<LogDocument>, ip: string): Query<LogDocument[], LogDocument>
  getByUserId(this: Model<LogDocument>, id: ObjectId): Query<LogDocument[], LogDocument>
  getByTime(this: Model<LogDocument>, time: number): Query<LogDocument[], LogDocument>
}

export interface ILogPage {
  page: number
  size: number
}

export interface ILogQuery extends ILogPage {
  fields?: string
  sort: string
  direction?: number
  page: number
  size: number
  [key: string]: any
}
