export {}
import type http from 'http'
import type express from 'express'
import type cors from 'cors'
import type cp from 'cookie-parser'
import type mongoose from 'mongoose'
import type { Redis } from 'ioredis'
import type { ApolloServer } from '@apollo/server'
import type { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import type { GraphQLError } from 'graphql'
import type passport from 'passport'
import type { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import type argon2 from 'argon2'
import type jwt from 'jsonwebtoken'

declare global {
    var http: typeof http
    var express: typeof express
    var cors: typeof cors
    var cp: typeof cp
    var mongoose: typeof mongoose
    var Redis: typeof Redis
    var ApolloServer: typeof ApolloServer
    var ApolloServerPluginDrainHttpServer: typeof ApolloServerPluginDrainHttpServer
    var GraphQLError: typeof GraphQLError
    var passport: typeof passport
    var JwtStrategy: typeof JwtStrategy
    var ExtractJwt: typeof ExtractJwt
    var argon2: typeof argon2
    var jwt: typeof jwt
}