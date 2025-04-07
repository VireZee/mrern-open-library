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