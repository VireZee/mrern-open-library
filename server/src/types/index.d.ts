export type User = {
    photo: string
    name: string
    username: string
    email: string
    verified: boolean
}
export type Context = {
    req: Req
    res: Res
    user: User | false
}