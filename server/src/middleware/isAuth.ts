import { NextFunction, Request, Response } from 'express'
import User, { IUser } from '../models/user.model'
import { AppError } from '../utils/AppError'

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.uid || req.session.passport?.user

  if (!userId) {
    return next(new AppError('Login to access this resource', 400))
  }

  const user: IUser | null = await User.findById<IUser>(userId)
  if (!user) {
    return next(new AppError('User not found', 400))
  }

  req.user = user
  next()
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(new AppError('Login to access this resource', 400))

  if (req.user.role !== 'admin')
    return next(
      new AppError('You are not authorized to access this resource', 400)
    )

  next()
}
