import { Router } from 'express'
import passport from '@config/passport.ts'
import apiController from '@controller/booksParent.ts'
import verifyController from '@controller/verify.ts'
import cookie from '@services/account/cookie.ts'
import type { User } from '@type/models/user.d.ts'

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
router.get('/auth/google/callback', (_, res) => {
    passport.authenticate('google', { session: false }, (err, user: User, info) => {
        if (!user) {
            return res.send(`
                <script>
                    window.opener.postMessage({ success: false, message: '${info.message}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
        if (err) {
            return res.send(`
                <script>
                    window.opener.postMessage({ success: false, message: '${err}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
        cookie(new TypesObjectId(user._id), res)
        return res.send(`
            <script>
                window.opener.postMessage({ success: true }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                window.close()
            </script>
        `)
    })(_, res)
})
router.get('/api/:token', apiController)
router.get('/verify/:id/:token', verifyController)
export default router