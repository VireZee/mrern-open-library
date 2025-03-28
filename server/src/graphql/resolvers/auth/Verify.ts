// import type { Request } from 'express'
// import { User } from '../../../models/User.ts'

// const VerifyEmail = async (_: null, args: { code: string }, context: { req: Request }) => {
//     const { req } = context
//     const t = req.cookies['!']
//     try {
//         const { id } = verifyToken(t)
//         const user = await User.findById(id)
//         const user = await User.findOne({ email })
//         if (!user) throw new GraphQLError("User not found", { extensions: { code: '404' } })
//         if (user.isVerified) throw new GraphQLError("Email already verified", { extensions: { code: '400' } })
//         if (!user.verificationCode || user.verificationCode !== args.code) throw new GraphQLError("Invalid verification code", { extensions: { code: '400' } })
//         if (user.codeExpiresAt && user.codeExpiresAt < new Date()) throw new GraphQLError("Verification code expired", { extensions: { code: '400' } })
//         user.isVerified = true
//         user.verificationCode = null
//         user.codeExpiresAt = null
//         await user.save()
//         return true
//     } catch (e) {
//         throw e
//     }
// }