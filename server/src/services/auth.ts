import generateToken from '@utils/security/jwt.ts'

export default (user: { _id: ObjectId }, res: Res) => {
    const t = generateToken(user._id)
    res.cookie('!', t, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: "strict",
        priority: "high"
    })
}