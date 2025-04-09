export type Id = {
    id: string
}
export type User = {
    photo: string
    name: string
    username: string
    email: string
    verified: boolean
}
export default interface IUser extends mongoDocument {
    _id: ObjectId
    photo: Buffer
    name: string
    username: string
    email: string
    pass: string
    verified: boolean
    api_key: Buffer
    created: Date
    updated: Date
}
export type Context = {
    req: Req
    res: Res
    user: Id | false
}