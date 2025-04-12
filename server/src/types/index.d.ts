import User from '@type/models/user.d.ts'

type Context = {
    req: Req
    res: Res
    user: User | false
}
export default Context