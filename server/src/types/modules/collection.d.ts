import type Collection from "@type/models/collection.d.ts"

type Books = Omit<Collection, 'user_id'>
export default Books