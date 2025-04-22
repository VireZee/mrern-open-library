import type Collection from "@type/models/collection.d.ts"
export type Query = {
    user_id: string
    title?: {
        $regex: string
        $options: 'i'
    }
}