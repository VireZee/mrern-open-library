import home from '@modules/book/resolver/home.js'
import fetch from '@modules/book/resolver/fetch.js'
import collection from '@modules/book/resolver/collection.js'
import addRemove from '@modules/book/resolver/addRemove.js'
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