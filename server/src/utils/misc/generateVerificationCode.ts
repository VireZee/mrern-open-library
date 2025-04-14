import userModel from "@models/user.ts"

export default async () => {
    const user = await userModel.findById(authUser._id)
    const randomString = nodeCrypto.randomBytes(64).toString('hex')
    const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
    await Redis.HSET(verifyKey, 'code', verificationCode)
    await Redis.HEXPIRE(verifyKey, 'code', 300)
    await emailService(user.email, verificationCode, user)
}