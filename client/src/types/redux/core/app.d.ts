export type User = {
    photo: string
    name: string
    uname: string
    email: string
    verified: boolean
}
export type State = {
    [key: string]: User | string | boolean | null | undefined
}