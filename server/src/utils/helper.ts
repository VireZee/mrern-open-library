import booksChild from '@modules/resolvers/api/books.ts'

export const helper = (user: { _id: ObjectId, photo: Buffer, name: string, username: string, email: string, verified: boolean, api_key?: string }) => {
    const { _id, photo, name, username, email, verified, api_key } = user
    return {
        _id: _id.toString(),
        photo: Buffer.from(photo).toString('base64'),
        name,
        username,
        email,
        verified,
        ...(api_key && { api_key: Buffer.from(api_key).toString('hex') })
    }
}
export const helper2 = async (res: Res, data: { _id: ObjectId, name: string, username: string }) => {
    const { _id, name, username } = data
    const books = await booksChild({ id: _id })
    return res.status(200).json({
        name,
        username,
        books
    })
}