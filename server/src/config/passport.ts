import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import { sanitize, sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatUser from '@utils/formatter/user.ts'

const opt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
passport.use(new JwtStrategy(opt, async (payload, done) => {
    try {
        const key = sanitizeRedisKey('user', payload.id)
        const cache = await Redis.json.GET(key)
        if (cache) return done(null, cache)
        const user: Parameters<typeof formatUser>[0] | null = await userModel.findById(sanitize(payload.id))
        if (!user) return done(null, false)
        await Redis.json.SET(key, '$', formatUser(user))
        await Redis.EXPIRE(key, 86400)
        return done(null, formatUser(user))
    } catch (e) {
        return done(e, false)
    }
}))
export default passport