import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import sanitize from '@utils/misc/sanitizedRedisKey.ts'

const opt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
passport.use(new JwtStrategy(opt, async (payload, done) => {
    try {
        const key = sanitize('user', payload.id)
        const result = await Redis.json.GET(key)
        if (result) return done(null, result)
        const user = await userModel.findById(payload.id)
        if (!user) return done(null, false)
        await Redis.json.SET(key, '$', {
            photo: Buffer.from(user.photo).toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            verified: user.verified
        })
        await Redis.expire(key, 86400)
        return done(null, user)
    } catch (e) {
        return done(e, false)
    }
}))
export default passport