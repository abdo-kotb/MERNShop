import { NextFunction, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'

import User from '../models/userModel.js'
import { UserReq } from '../types.js'

const protect = asyncHandler(async (req: UserReq, res, next) => {
  let token: string

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  try {
    token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById((decoded as JwtPayload).id).select(
      '-password'
    )
    next()
  } catch (error) {
    console.error(error)
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
})

const isAdmin = (req: UserReq, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) next()
  else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, isAdmin }
