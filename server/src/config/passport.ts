import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import { sanitize, sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const opt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
passport.use(new JwtStrategy(opt, async (payload, done) => {
    try {
        const key = sanitizeRedisKey('user', payload.id)
        let result = await Redis.json.GET(key)
        if (!result) {
            const exists = await userModel.findById(sanitize(payload.id))
            if (!exists) return done(null, false)
            result = { id: payload.id }
            await Redis.json.SET(key, '$', result)
            await Redis.expire(key, 86400)
        }
        return done(null, result)
    } catch (e) {
        return done(e, false)
    }
}))
export default passport