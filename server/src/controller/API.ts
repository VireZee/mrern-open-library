import userModel from '@models/user.ts'
import Books from '@modules/resolvers/api/books.ts'

const API = async (req: Req, res: Res) => {
    try {
        const { hash } = req.params
        const hashBuffer = Buffer.from(hash!, 'hex')
        const user = await userModel.findOne({ api_key: hashBuffer })
        if (!user) return res.status(404).json({ message: 'Invalid API Key!' })
        const books = await Books({ id: user!._id })
        const response = {
            email: user!.email,
            username: user!.username,
            books
        }
        return res.status(200).json(response)
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message })
        } else {
            return res.status(500).json({ unknownError: e })
        }
    }
}
export default API