import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import Redis from '../database/Redis.ts'
import { User } from '../models/User.ts'

passport.use(
    new JwtStrategy({ jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies['!']]), secretOrKey: process.env['SECRET_KEY']! }, async (payload, done) => {
        try {
            const redisKey = `user:${payload.id}`
            const cached = await Redis.call('JSON.GET', redisKey) as string
            if (cached) return done(null, JSON.parse(cached))
            const user = await User.findById(payload.id)
            if (!user) return done(null, false)
            await Redis.call('JSON.SET', redisKey, '$', JSON.stringify({
                photo: user.photo.toString(),
                name: user.name,
                username: user.username,
                email: user.email,
                verified: user.verified
            }))
            await Redis.expire(redisKey, 86400)
            return done(null, user)
        } catch (e) {
            return done(e, false)
        }
    })
)
export default passport