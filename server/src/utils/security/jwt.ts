import jwt from 'jsonwebtoken'

const generateToken = (id: ObjectId) => jwt.sign({ id }, process.env['SECRET_KEY']!, { algorithm: 'HS512', expiresIn: '30d' })
export default generateToken