import { Router } from 'express'
import passport from '@config/passport.js'
import apiController from '@controller/booksParent.js'
import verifyController from '@controller/verify.js'
import cookie from '@services/account/cookie.js'
import type { User } from '@type/models/user.d.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/auth/google/register', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'register',
    prompt: 'select_account'
}))
router.get('/auth/google/login', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'login',
    prompt: 'select_account'
}))
router.get('/auth/google/connect', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'connect',
    prompt: 'select_account'
}))
router.get('/auth/google/callback', (_, res) => {
    passport.authenticate('google', { session: false }, (err, user: User, info) => {
        if (!user) {
            return res.send(`
                <script>
                    window.opener.postMessage({ message: '${info.message}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
        if (err) {
            return res.send(`
                <script>
                    window.opener.postMessage({ message: '${err}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
        cookie(new TypesObjectId(user._id), res)
        return res.send(`
            <script>
                window.opener.postMessage({ message: '' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                window.close()
            </script>
        `)
    })(_, res)
})
router.get('/api/:token', apiController)
router.get('/verify/:id/:token', verifyController)
export default router