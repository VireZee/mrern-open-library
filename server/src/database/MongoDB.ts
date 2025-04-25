import '@config/env.ts'
import mongoose from 'mongoose'

const MongoDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env['MONGODB_USER']}:${process.env['MONGODB_PASS']}@${process.env['DB_HOST']}:${process.env['MONGODB_PORT']}/${process.env['MONGODB_NAME']}?directConnection=true&authMechanism=SCRAM-SHA-256`)
        const collections = await mongoose.connection.db!.listCollections().toArray()
        const collectionNames = collections.map(col => col.name)
        const targetCollections = ['users', 'collections']
        for (const name of targetCollections) {
            if (!collectionNames.includes(name)) {
                await mongoose.connection.db!.createCollection(name, {
                    collation: {
                        locale: 'en',
                        strength: 5,
                        caseLevel: true,
                        caseFirst: 'upper',
                        numericOrdering: true,
                        alternate: 'non-ignorable',
                        maxVariable: 'punct',
                        backwards: false,
                        normalization: true
                    }
                })
            }
        }
    } catch (e) {
        throw e
    }
}
export default MongoDB