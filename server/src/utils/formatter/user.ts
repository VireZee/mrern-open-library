export default (user: { _id: ObjectId, googleId: string, photo: Buffer, name: string, username: string, email: string, verified: boolean, api_key?: string }) => {
    const { _id, googleId, photo, name, username, email, verified, api_key } = user
    return {
        _id: _id.toString(),
        google: !!googleId,
        photo: Buffer.from(photo).toString('base64'),
        name,
        username,
        email,
        verified,
        ...(api_key && { api_key: Buffer.from(api_key).toString('hex') })
    }
}