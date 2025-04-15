export type User = {
    _id: string
    photo: string
    name: string
    username: string
    email: string
    verified: boolean
    api_key?: string
}
export type UserSettings = {
    photo: string
    name: string
    username: string
    email: string
    pass: string
    updated: Date
}