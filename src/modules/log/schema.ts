import { ObjectId, Schema, Model, model } from 'mongoose'
import { timestamps } from '../../util/db'
import { LogDocument, LogModel } from './typings'
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
LogSchema.statics.getByAction = function (this: Model<LogDocument>, action: string) {
  return this.find({ action })
}

LogSchema.statics.getByRequestIp = function (this: Model<LogDocument>, ip: string) {
  return this.find({ request_id: ip })
}

LogSchema.statics.getByAction = function (this: Model<LogDocument>, id: ObjectId) {
  return this.find({ user_id: id })
}

LogSchema.statics.getByTime = function (this: Model<LogDocument>, time: number) {
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
}

export default model<LogDocument, LogModel>('Log', LogSchema)
