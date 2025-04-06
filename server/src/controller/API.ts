import { User } from '@models/User.ts'
import Books from '@modules/resolvers/api/Books.ts'

const API = async (req: Req, res: Res) => {
    try {
        const { hash } = req.params
        const hashBuffer = Buffer.from(hash!, 'hex')
        const user = await User.findOne({ api_key: hashBuffer })
        if (!user) return res.status(404).json({ message: 'Invalid API Key!' })
        const books = await Books({ id: user!._id })
        const response = {
            email: user!.email,
            username: user!.username,
            books
        }
        return res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response, null, 2))
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message })
        } else {
            return res.status(500).json({ unknownError: e })
        }
    }
}
export default API