import type { Types } from 'mongoose'
import type { Request, Response } from 'express'
import type crypto from 'crypto'

declare global {
    type CollectionInfo = mongoose.mongo.CollectionInfo | Pick<mongoose.mongo.CollectionInfo, "name" | "type">
    type ObjectId = Types.ObjectId
    type Req = Request
    type Res = Response
    var TypesObjectId = Types.ObjectId
    var nodeCrypto: typeof crypto
}
export {}