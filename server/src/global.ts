import mongoose from 'mongoose'
import { Redis } from 'ioredis'
import express from 'express'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'
globalThis.mongoose = mongoose
globalThis.Redis = Redis
globalThis.express = express
globalThis.nodeCrypto = crypto
globalThis.GraphQLError = GraphQLError
export {}