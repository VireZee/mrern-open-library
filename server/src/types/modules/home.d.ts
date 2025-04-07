type Query = {
    user_id: ObjectId
    title?: {
        $regex: string
        $options: 'i'
    }
}
export default Query