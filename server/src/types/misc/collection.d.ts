import type Collection from '@type/models/collection.d.ts'

type Query = {
    user_id: string
    title?: {
        $regex: string
        $options: 'i'
    }
}
export default Query