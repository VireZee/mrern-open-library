export type User = {
    _id: string
    photo: string
    name: string
    username: string
    email: string
    verified: boolean
    api_key?: string
}
export type Context = {
    req: Req
    res: Res
    user: Id | false
}