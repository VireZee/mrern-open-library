import type Collection from "@type/models/collection.d.ts"

export type Books = Omit<Collection, 'user_id'>
export type Query = {
    user_id: string
    title?: {
        $regex: string
        $options: 'i'
    }
}