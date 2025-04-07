import './global.ts'
import http from 'http'
import cors from 'cors'
import cp from 'cookie-parser'
import MongoDB from '@database/MongoDB.ts'
import '@database/Redis.ts'
import passport from '@config/passport.ts'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from '@modules/Resolver.ts'
import APIRt from './routes/api.ts'

interface UserType {
    photo: string
    name: string
    username: string
    email: string
    verified: boolean
}

interface MyContext {
    req: Req
    res: Res
    user: UserType | null
}

await MongoDB()
const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
(async () => {
    await server.start()
    app.use(
        '/gql',
        cors<cors.CorsRequest>({ origin: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`, credentials: true }),
        express.json({ limit: '5mb' }),
        cp(),
        passport.initialize(),
        expressMiddleware(server, {
            context: async ({ req, res }): Promise<MyContext> => {
                return new Promise((resolve, reject) => {
                    passport.authenticate('jwt', { session: false }, (err: Error, user: UserType) => {
                        if (err) return reject(err)
                        console.log(user)
                        return resolve({ req, res, user })
                    })(req, res, () => null)
                })
            }
        })
    )
    app.use(APIRt)
})()
httpServer.listen(process.env['PORT'])