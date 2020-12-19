import { ObjectId, Document, Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
export enum HttpMethods {
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
}

export interface ILog extends Document {
  _id: ObjectId
  action: string
  module: string
  user_id: ObjectId
  user_name: string
  request_url: string
  request_id: string
  request_method: HttpMethods
  request_times: Number
  system: string
}

export const LogSchema = new Schema(
  {
    action: {
      type: Schema.Types.String,
      required: true,
    },
    module: {
      type: Schema.Types.String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user_name: {
      type: Schema.Types.String,
      required: true,
    },
    request_url: {
      type: Schema.Types.String,
      required: true,
    },
    request_ip: {
      type: Schema.Types.String,
      required: true,
    },
    request_method: {
      type: Schema.Types.String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      required: true,
    },
    request_params: {
      type: Schema.Types.String,
    },
    request_times: {
      type: Schema.Types.Number,
      required: true,
    },
    system: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  timestamps,
)
const Log = createCollection<ILog>('Authority', LogSchema)
export default Log
