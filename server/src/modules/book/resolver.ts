import home from '@modules/book/resolver/home.ts'
import fetch from '@modules/book/resolver/fetch.ts'
import collection from '@modules/book/resolver/collection.ts'
import addRemove from '@modules/book/resolver/addRemove.ts'
export default {
    Query: {
        home,
        fetch,
        collection
    },
    Mutation: {
        add: addRemove,
        remove: addRemove
    }
}