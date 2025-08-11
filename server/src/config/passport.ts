import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'
import type { StrategyOptionsWithRequest } from 'passport-google-oauth20'
import { sanitize, sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatName } from '@utils/validators/name.ts'
import formatUser from '@utils/formatter/user.ts'
import generateUniqueUsername from '@utils/misc/generateUniqueUsername.ts'
import jwt, { type JwtPayload } from 'jsonwebtoken'

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
        const photoUrl = profile.photos![0]!.value
        const name = [profile.name!.givenName, profile.name!.familyName].filter(Boolean).join(' ')
        const email = profile.emails![0]!.value
        const state = req.query['state']
        if (state === 'register') {
            if (await userModel.findOne({ googleId }).lean()) return done(null, false, { message: 'Google account is already registered! Try logging in with Google!' })
            const newUser = new userModel({
                googleId,
                photo: photoUrl,
                name: formatName(name),
                username: await generateUniqueUsername(email.split('@')[0]!),
                email,
                pass: '',
                verified: true
            })
            await newUser.save()
            return done(null, newUser)
        } else if (state === 'login') {
            const user = await userModel.findOne({ googleId }).lean()
            if (!user) return done(null, false, { message: 'Google account is not registered! Try registering it with Google!' })
            return done(null, user)
        } else if (state === 'connect') {
            const decoded = jwt.verify(req.cookies['!'], process.env['SECRET_KEY']!) as JwtPayload
            const user = await userModel.findById(sanitize(decoded['id']))
            if (!user!.googleId) await userModel.findByIdAndUpdate(user!._id, { googleId })
            else if (user!.googleId) await userModel.findByIdAndUpdate(user!._id, { $unset: { googleId } })
        }
    } catch (e) {
        return done(e, false)
    }
}))
export default passport