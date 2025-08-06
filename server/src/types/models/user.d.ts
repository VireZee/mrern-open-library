type BaseUser = {
    photo: string
    name: string
    username: string
    email: string
}
export type User = BaseUser & {
    _id: string
    verified: boolean
    api_key?: string
}
export type UserSettings = BaseUser & {
    pass: string
    updated: Date
}
export type GoogleUser = BaseUser & {
    googleId: string
}