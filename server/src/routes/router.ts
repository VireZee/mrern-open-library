import { Router } from 'express'
import passport from '@config/passport.ts'
import apiController from '@controller/booksParent.ts'
import verifyController from '@controller/verify.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/auth/google/register', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'register'
}))
router.get('/auth/google/login', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'login'
}))
router.get('/auth/google/connect', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'connect'
}))
router.get('/auth/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
}),
    // (req, res) => {
    //     const state = req.query['state']
    //     const profile = req.user
    //     if (!profile) return res.redirect('/login')
    //     const googleId = profile.id
    //     const email = profile.emails?.[0]?.value
    //     const name = profile.displayName
    //     const photo = profile.photos?.[0]?.value
    // }
)
router.get('/api/:token', apiController)
router.get('/verify/:id/:token', verifyController)
export default router