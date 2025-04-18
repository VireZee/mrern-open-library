
import collectionService from '@services/book/collection.ts'

const booksChild = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        collectionService('collection', { _id: id.toString() })
    } catch (e) {
        throw e
    }
}
export default booksChild