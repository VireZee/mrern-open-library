import generateToken from '@utils/security/jwt.ts'
export default (user: { _id: ObjectId }, res: Res) => {
    const token = generateToken(user._id)
    res.cookie('!', token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        priority: "high"
    })
}