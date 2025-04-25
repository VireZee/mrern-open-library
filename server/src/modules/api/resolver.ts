import check from '@modules/api/resolver/check.ts'
import generate from '@modules/api/resolver/generate.ts'
export default {
    Query: {
        check
    },
    Mutation: {
        generate
    }
}