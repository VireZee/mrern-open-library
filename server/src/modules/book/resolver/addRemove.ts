import collection from '@models/collection.ts'
import updateService from '@services/state/update.ts'
import type { User } from '@type/models/user.d.ts'

const addRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[] }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const { user } = context
        const bookCollection = await collection.findOne({
            user_id: user._id,
            author_key,
            cover_edition_key,
            cover_i
        })
        if (bookCollection) {
            await collection.findByIdAndDelete(bookCollection._id)
            updateService('collection', user)
        }
        else {
            await collection.create({
                user_id: user._id,
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name,
                created: new Date()
            })
            updateService('collection', user)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default addRemove