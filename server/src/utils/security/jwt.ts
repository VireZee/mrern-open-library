import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

export const generateToken = (id: Types.ObjectId) => jwt.sign({ id }, process.env['SECRET_KEY']!, { algorithm: 'HS512', expiresIn: '30d' })