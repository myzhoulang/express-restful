import { ObjectId, Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
import { LogDocument, LogModelConstructor } from './typings'
export const LogSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    user_name: {
      type: Schema.Types.String,
    },
    request_url: {
      type: Schema.Types.String,
    },
    request_ip: {
      type: Schema.Types.String,
    },
    request_method: {
      type: Schema.Types.String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      required: true,
      default: 'GET',
    },
    request_body: {
      type: Schema.Types.String,
    },
    request_times: {
      type: Schema.Types.Number,
    },
    request_status: {
      type: Schema.Types.Number,
    },
    system: {
      type: Schema.Types.ObjectId,
    },
  },
  timestamps,
)

// FIXME: 查询结果条数处理
// 查询出的数据可能包含 N 条
// 如何处理？
LogSchema.statics.getByAction = function (action: string) {
  return this.find({ action })
} as LogModelConstructor['getByAction']

LogSchema.statics.getByRequestIp = function (ip: string) {
  return this.find({ request_id: ip })
} as LogModelConstructor['getByRequestIp']

LogSchema.statics.getByAction = function (id: ObjectId) {
  return this.find({ user_id: id })
} as LogModelConstructor['getByUserId']

LogSchema.statics.getByTime = function (time: number) {
  const sTime = String(time)
  let oper
  if (sTime.startsWith('-')) {
    oper = { $lt: time }
  } else if (sTime.startsWith('+')) {
    oper = { $gt: time }
  } else {
    oper = time
  }
  return this.find({ time: oper })
} as LogModelConstructor['getByTime']

const Log = createCollection<LogDocument>('Log', LogSchema) as LogModelConstructor
export default Log
