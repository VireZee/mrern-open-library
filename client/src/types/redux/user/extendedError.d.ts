import type BaseError from '@type/redux/user/baseError'

type ExtendedError = BaseError & {
    photo?: string
    oldPass?: string
    newPass?: string
}
export default ExtendedError