import MongoDB from './database/MongoDB.ts'
import './database/Redis.ts'
import express from 'express'
import http from 'http'
import cors from 'cors'
import cp from 'cookie-parser'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/Resolver.ts'
import APIRt from './routes/API.ts'

await MongoDB()
const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
(async () => {
    await server.start()
    app.use(
        '/gql',
        cors<cors.CorsRequest>({ origin: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`, credentials: true }),
        express.json({ limit: "5mb" }),
        cp(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res })
        })
    )
    app.use(APIRt)
})()
httpServer.listen(process.env['PORT'])