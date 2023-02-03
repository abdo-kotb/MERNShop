import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const generateToken = (id: mongoose.Types.ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

export default generateToken
