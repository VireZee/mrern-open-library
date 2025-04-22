import { Types } from 'mongoose'
import express from 'express'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'
globalThis.TypesObjectId = Types.ObjectId
globalThis.express = express
globalThis.nodeCrypto = crypto
globalThis.GraphQLError = GraphQLError
export {}