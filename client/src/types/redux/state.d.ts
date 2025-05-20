import type User from '@type/redux/user/user'
import type BaseError from '@type/redux/user/baseError'
import type ExtendedError from '@type/redux/user/extendedError'
import type Books from '@type/redux/book/book'

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
export type GlobalBookState = {
    [_: string]:
    | Books[]
    | Record<string, boolean>
    | string
    | number
    | boolean
    | null
    | undefined
    status?: Record<string, boolean>
}