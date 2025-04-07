export default interface ICollection extends mongoDocument {
    _id: ObjectId
    user_id: ObjectId
    author_key: string[]
    cover_edition_key: string
    cover_i: number
    title: string
    author_name: string[]
    created: Date
}