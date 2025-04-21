export type Errors = {
    photo?: string
    name?: string
    uname?: string
    email?: string
    oldPass?: string
    newPass?: string
    rePass?: string
}
export type State = {
    [key: string]: boolean | number | string | { old: boolean, new: boolean } | Errors
}