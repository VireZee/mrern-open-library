import register from '@modules/auth/resolver/register.js'
import verify from '@modules/auth/resolver/verify.js'
import resend from '@modules/auth/resolver/resend.js'
import login from '@modules/auth/resolver/login.js'
import settings from '@modules/auth/resolver/settings.js'
import logout from '@modules/auth/resolver/logout.js'
import forget from '@modules/auth/resolver/forget.js'
import validate from '@modules/auth/resolver/validate.js'
import reset from '@modules/auth/resolver/reset.js'
import terminate from '@modules/auth/resolver/terminate.js'
export default {
    Mutation: {
        register,
        verify,
        resend,
        login,
        settings,
        logout,
        forget,
        validate,
        reset,
        terminate
    }
}