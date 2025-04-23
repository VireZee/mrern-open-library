import User from '@type/models/user.d.ts'

type Context = {
    res: Res
    user: User | false
}
export default Context