import { Schema, Model, model } from 'mongoose'
import xss from 'xss'
import { timestamps } from '../../util/db'
import { LogDocument, LogModel } from './typings'

export const LogSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    user_name: {
      type: Schema.Types.String,
      default: '',
      set(value: string) {
        return xss(value)
      },
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
      default: '',
      set(value: string) {
        return xss(value)
      },
    },
    request_times: {
      type: Schema.Types.Number,
    },
    status: {
      type: Schema.Types.Number,
    },
    error_message: {
      type: Schema.Types.String,
    },
    system: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    ...timestamps,
  },
)

export default model<LogDocument, LogModel>('Log', LogSchema)
