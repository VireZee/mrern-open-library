import { Types } from 'mongoose'
import { User } from '../models/User.ts'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'


export const validateEmail = async (email: string, id?: Types.ObjectId) => {
    if (!email) {
        return "Email can't be empty!"
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return "Email must be valid!"
    } else if (await User.findOne({
        email,
        ...(id && { _id: { $ne: id } })

    })) {
        return "Email is already registered!"
    }
    return
}
export const hash = async (pass: string) => {
    const generateSecretKey = () => {
        const ranges = [
            { s: 0x0020, e: 0x007E },
            { s: 0x00A1, e: 0x02FF },
            { s: 0x0370, e: 0x052F }
        ]
        const str: string[] = []
        ranges.forEach(r => {
            for (let i = r.s; i <= r.e; i++) str.push(String.fromCharCode(i))
        })
        let rslt = ''
        for (let i = 0; i < 512; i++) {
            const shfl = Math.floor(Math.random() * str.length)
            rslt += str[shfl]
        }
        return rslt
    }
    const opt: argon2.Options = {
        hashLength: 128,
        timeCost: 6,
        memoryCost: 128 * 1024,
        parallelism: 4,
        type: 2,
        salt: Buffer.from(generateSecretKey(), 'utf-8')
    }
    return await argon2.hash(pass + process.env['PEPPER'], opt)
}
export const verifyHash = async (pass: string, hashedPass: string) => await argon2.verify(hashedPass, pass + process.env['PEPPER'])
export const generateToken = (id: Types.ObjectId) => jwt.sign({ id }, process.env['SECRET_KEY']!, { algorithm: 'HS512', expiresIn: '30d' })
export const verifyToken = (t: string) => jwt.verify(t, process.env['SECRET_KEY']!) as jwt.JwtPayload