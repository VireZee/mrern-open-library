import jwt from 'jsonwebtoken'
export default (id: ObjectId) => jwt.sign({ id }, process.env['SECRET_KEY']!, { algorithm: 'HS512', expiresIn: '30d' })