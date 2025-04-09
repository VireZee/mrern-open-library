import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import booksChild from '@modules/resolvers/api/books.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const booksParent = async (req: Req, res: Res) => {
    try {
        const { hash } = req.params
        const hashBuffer = Buffer.from(hash!, 'hex')
        const key = sanitizeRedisKey('api', hash!)
        const cache = await Redis.json.GET(key)
        if (cache) {
            const books = await booksChild({ id: cache._id })
            return res.status(200).json({
                name: cache.name,
                username: cache.username,
                books
            })
        }
        const user = await userModel.findOne({ api_key: hashBuffer })
        if (!user) return res.status(404).json({ message: 'Invalid API Key!' })
        const books = await booksChild({ id: user!._id })
        return res.status(200).json({
            name: user!.name,
            username: user!.username,
            books
        })
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message })
        } else {
            return res.status(500).json({ unknownError: e })
        }
    }
}
export default booksParent