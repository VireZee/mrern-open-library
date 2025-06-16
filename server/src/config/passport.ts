import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import type { StrategyOptions } from 'passport-google-oauth20'
import { sanitize, sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatUser from '@utils/formatter/user.ts'

const jwtOpt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
const googleOpt: StrategyOptions = {
    clientID: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}
passport.use(new JwtStrategy(jwtOpt, async (payload, done) => {
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
passport.use(new GoogleStrategy(googleOpt, async (_, __, profile, done) => {
    try {
        const googleId = profile.id
        const key = sanitizeRedisKey('google', googleId)
        const cache = await Redis.json.GET(key)
        if (cache) return done(null, cache)
        const user = await userModel.findOne({ googleId })
        if (!user) return done(null, false)
        await Redis.json.SET(key, '$', '')
        await Redis.EXPIRE(key, 86400)
        return done(null, '')
    } catch (e) {
        return done(e, false)
    }
}))
export default passport