import http from 'http'
import express from 'express'
import cors from 'cors'
import cp from 'cookie-parser'
import mongoose from 'mongoose'
import { Redis } from 'ioredis'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { GraphQLError } from 'graphql'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

globalThis.http = http
globalThis.express = express
globalThis.cors = cors
globalThis.cp = cp
globalThis.mongoose = mongoose
globalThis.Redis = Redis
globalThis.ApolloServer = ApolloServer
globalThis.ApolloServerPluginDrainHttpServer = ApolloServerPluginDrainHttpServer
globalThis.GraphQLError = GraphQLError
globalThis.passport = passport
globalThis.JwtStrategy = JwtStrategy
globalThis.ExtractJwt = ExtractJwt
globalThis.argon2 = argon2
globalThis.jwt = jwt
export {}