import type mongoose, { Document, Schema, Types } from 'mongoose'
import type { Redis } from 'ioredis'
import type express, { Request, Response } from 'express'
import type crypto from 'crypto'
import type { GraphQLError } from 'graphql'

declare global {
    type CollectionInfo = mongoose.mongo.CollectionInfo | Pick<mongoose.mongo.CollectionInfo, "name" | "type">
    type mongoDocument = Document
    type ObjectId = Types.ObjectId
    type Req = Request
    type Res = Response
    var mongoose: typeof mongoose
    var Schema = mongoose.Schema
    var Redis: typeof Redis
    var express: typeof express
    var nodeCrypto: typeof crypto
    var GraphQLError: typeof GraphQLError
}
export {}