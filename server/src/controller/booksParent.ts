import userModel from '@models/user.ts'
import booksChild from '@modules/resolvers/api/booksChild.ts'

const booksParent = async (req: Req, res: Res) => {
    try {
        const { hash } = req.params
        const hashBuffer = Buffer.from(hash!, 'hex')
        const user = await userModel.findOne({ api_key: hashBuffer })
        if (!user) return res.status(404).json({ message: 'Invalid API Key!' })
        const books = await booksChild({ id: user._id.toString() })
        return res.status(200).json({
            api: user!.api_key,
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