import './global.ts'
import http from 'http'
import cors from 'cors'
import cp from 'cookie-parser'
import MongoDB from '@database/MongoDB.ts'
import '@database/Redis.ts'
import passport from '@config/passport.ts'
import { typeDefs, resolvers } from '@modules/Resolver.ts'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import apiRoute from '@routes/router.ts'
import type Context from '@type/index.d.ts'
import type User from '@type/models/user.d.ts'

await MongoDB()
const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})
await server.start()
app.use(cors({ origin: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`, credentials: true }))
app.use(cp())
app.use(express.json({ limit: '5mb' }))
app.use(passport.initialize())
app.use(
    '/gql',
    expressMiddleware(server, {
        context: async ({ req, res }): Promise<Context> => {
            return new Promise((resolve, reject) => {
                passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
                    if (err) return reject(err)
                    return resolve({ req, res, user })
                })(req, res, () => null)
            })
        }
    })
)
app.use(apiRoute)
httpServer.listen(process.env['PORT'])