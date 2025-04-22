import type User from '@type/redux/user/user'
import type BaseError from '@type/redux/user/baseError'
import type ExtendedError from '@type/redux/user/extendedError'

export type GlobalUserState = {
    [_: string]:
    | User
    | BaseError
    | ExtendedError
    | { old: boolean, new: boolean }
    | string
    | boolean
    | null
    | undefined
}