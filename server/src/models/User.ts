import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IUser extends Document {
    _id: Types.ObjectId
    photo: Buffer
    name: string
    username: string
    email: string
    pass: string
    api_key: Buffer
    created: Date
    updated: Date
}
const UserSchema = new Schema<IUser>({
    photo: { type: Buffer, required: true },
    name: { type: String, maxlength: 75, required: true, },
    username: { type: String, unique: true, maxlength: 20, required: true },
    email: { type: String, unique: true, required: true },
    pass: { type: String, required: true },
    api_key: { type: Buffer },
    updated: { type: Date },
    created: { type: Date, required: true }
}, { versionKey: false })
export const User = mongoose.model<IUser>('User', UserSchema)