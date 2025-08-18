import Redis from '@database/Redis.js'
import userModel from '@models/user.js'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, type StrategyOptionsWithoutRequest } from 'passport-jwt'
import { Strategy as GoogleStrategy, type StrategyOptionsWithRequest } from 'passport-google-oauth20'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { sanitize, sanitizeRedisKey } from '@utils/security/sanitizer.js'
import { formatName } from '@utils/validators/name.js'
import formatUser from '@utils/formatter/user.js'
import generateSvg from '@utils/misc/generateSvg.js'
import generateUniqueUsername from '@utils/misc/generateUniqueUsername.js'

const jwtOpt: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]),
    secretOrKey: process.env['SECRET_KEY']!
}
const googleOpt: StrategyOptionsWithRequest = {
    clientID: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackURL: `http://${process.env['DOMAIN']}:${process.env['PORT']}/auth/google/callback`,
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
        const name = [profile.name!.givenName, profile.name!.familyName].filter(Boolean).join(' ')
        const email = profile.emails![0]!.value
        const state = req.query['state']
        if (state === 'register') {
            if (await userModel.findOne({ googleId }).lean()) return done(null, false, { message: 'Google account is already registered! Try logging in with Google!' })
            const newUser = new userModel({
                googleId,
                photo: Buffer.from(generateSvg(name), 'base64'),
                name: formatName(name),
                username: await generateUniqueUsername(email.split('@')[0]!),
                email,
                pass: null,
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
            let updateQuery: Record<string, string | Record<string, string>> = {}
            if (!user!.googleId) updateQuery = { googleId }
            else if (user!.googleId === googleId) {
                if (!user!.pass) return done(null, false, { message: 'Set a password before disconnecting your account from Google!' })
                updateQuery = { $unset: { googleId } }
            } else if (user!.googleId !== googleId) return done(null, false, { message: 'The selected Google account does not match the one connected to your profile!' })
            const updatedUser = await userModel.findByIdAndUpdate(user!._id, updateQuery, { new: true }).lean()
            await Redis.json.SET(sanitizeRedisKey('user', user!._id), '$.google', !!updatedUser!.googleId)
            return done(null, updatedUser!)
        }
    } catch (e) {
        return done(e, false)
    }
}))
export default passport