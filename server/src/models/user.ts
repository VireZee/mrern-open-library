import mongoose, { Schema, HydratedDocument } from 'mongoose'

const userSchema = new Schema({
    photo: { type: Buffer, required: true },
    name: { type: String, maxlength: 75, required: true, },
    username: { type: String, unique: true, maxlength: 20, required: true },
    email: { type: String, unique: true, required: true },
    pass: { type: String, required: function (this: HydratedDocument<>) { return !this.googleId } },
    googleId: { type: String, unique: true, sparse: true },
    registeredWithGoogle: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    api_key: { type: Buffer },
    updated: { type: Date },
    created: { type: Date, default: new Date(), required: true }
}, { versionKey: false })
export default mongoose.model('User', userSchema)