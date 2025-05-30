import register from '@modules/auth/resolver/register.ts'
import verify from '@modules/auth/resolver/verify.ts'
import resend from '@modules/auth/resolver/resend.ts'
import login from '@modules/auth/resolver/login.ts'
import settings from '@modules/auth/resolver/settings.ts'
import logout from '@modules/auth/resolver/logout.ts'
import forget from '@modules/auth/resolver/forget.ts'
import validate from '@modules/auth/resolver/validate.ts'
import reset from '@modules/auth/resolver/reset.ts'
import terminate from '@modules/auth/resolver/terminate.ts'
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