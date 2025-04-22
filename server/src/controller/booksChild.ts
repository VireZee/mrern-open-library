import createCollection from '@services/redis/createCollection.ts'

const booksChild = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        return createCollection('collection', id)
    } catch (e) {
        throw e
    }
}
export default booksChild