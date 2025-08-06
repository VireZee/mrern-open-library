import mongoose, { Schema, type HydratedDocument } from 'mongoose'
import type { GoogleUser } from '@type/models/user.d.ts'

const userSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    photo: { type: Buffer, required: true },
    name: { type: String, maxlength: 75, required: true, },
    username: { type: String, unique: true, maxlength: 20, required: true },
    email: { type: String, unique: true, required: true },
    pass: { type: String, required: function (this: HydratedDocument<GoogleUser>) { return !this.googleId } },
    verified: { type: Boolean, default: false },
    api_key: { type: Buffer },
    updated: { type: Date },
    created: { type: Date, default: new Date(), required: true }
}, { versionKey: false })
export default mongoose.model('User', userSchema)