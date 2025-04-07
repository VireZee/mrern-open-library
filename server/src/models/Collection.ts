import type ICollection from '@type/models/collection.d.ts'

const CollectionSchema = new Schema<ICollection>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    author_key: { type: [String], required: true },
    cover_edition_key: { type: String, required: true },
    cover_i: { type: Number, required: true },
    title: { type: String, required: true },
    author_name: { type: [String], required: true },
    created: { type: Date, required: true }
}, { versionKey: false })
export default mongoose.model<ICollection>('collection', CollectionSchema)