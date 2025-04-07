import type IUser from '@type/models/user.d.ts'

const UserSchema = new Schema<IUser>({
    photo: { type: Buffer, required: true },
    name: { type: String, maxlength: 75, required: true, },
    username: { type: String, unique: true, maxlength: 20, required: true },
    email: { type: String, unique: true, required: true },
    pass: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true },
    api_key: { type: Buffer },
    updated: { type: Date },
    created: { type: Date, default: new Date(), required: true }
}, { versionKey: false })
export default mongoose.model<IUser>('user', UserSchema)