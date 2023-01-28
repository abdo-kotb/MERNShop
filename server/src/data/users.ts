import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'Abdulrhman Kotb',
    email: 'aabdamoh@gmail.com',
    password: bcrypt.hashSync('123456'),
  },
  {
    name: 'Abdo Kotb',
    email: 'abdo@example.com',
    password: bcrypt.hashSync('123456'),
  },
]

export default users
