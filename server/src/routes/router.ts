import { Router } from 'express'
import passport from '@config/passport.ts'
import apiController from '@controller/booksParent.ts'
import verifyController from '@controller/verify.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
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