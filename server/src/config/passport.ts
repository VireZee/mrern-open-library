import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import type { StrategyOptionsWithRequest } from 'passport-google-oauth20'
import { sanitize, sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatName } from '@utils/validators/name.ts'
import { formatUsername } from '@utils/validators/username.ts'
import formatUser from '@utils/formatter/user.ts'

const jwtOpt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
const googleOpt: StrategyOptionsWithRequest = {
    clientID: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
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
passport.use(new GoogleStrategy(googleOpt, async (req, _, __, profile, done) => {
    try {
        const googleId = profile.id
        const email = profile.emails![0]!.value
        const name = profile.displayName
        const photoUrl = profile.photos![0]!.value
        const state = req.query['state']
        if (state === 'register') {
            if (await userModel.findOne({ googleId }))
                return done(null, false)
            if (await userModel.findOne({ email }))
                return done(null, false)
            const newUser = new userModel({
                googleId,
                photo: photoUrl,
                name: formatName(name),
                username: formatUsername(email.split('@')[0]!),
                email,
                pass: '',
                registeredWithGoogle: true,
                verified: true
            })
            await newUser.save()
            return done(null, newUser)
        } else if (state === 'login') {
            return
        } else if (state === 'connect') {
            return
        }
    } catch (e) {
        return done(e, false)
    }
}))
export default passport