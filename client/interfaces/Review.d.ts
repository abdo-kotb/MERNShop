import User from './user'

export default interface Review {
  _id: string
  name: string
  rating: number
  comment: string
  user: User
  createdAt: string
}
