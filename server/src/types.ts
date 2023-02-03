import { Request } from 'express'

export interface UserReq extends Request {
  user: any
}
