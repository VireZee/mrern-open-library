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
// router.get('/auth/google/callback',
//     passport.authenticate('google', {
//         session: false,
//         failureRedirect: '/login'
//     }),
//     (req, res) => {
//         const user = req.user
//         const token = generateJwt(user)
//         res.cookie('!', token, { httpOnly: true, sameSite: 'lax' })
//         res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`)
//     }
// )
router.get('/api/:token', apiController)
router.get('/verify/:id/:token', verifyController)
export default router