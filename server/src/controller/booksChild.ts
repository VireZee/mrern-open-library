
import createService from '@services/state/create.ts'

const booksChild = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        return createService('collection', { _id: id.toString() })
    } catch (e) {
        throw e
    }
}
export default booksChild