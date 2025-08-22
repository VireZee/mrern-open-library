import { createClient } from 'redis'

const Redis = createClient({
    socket: {
        host: process.env['REDIS_HOST'],
        port: Number(process.env['REDIS_PORT'])
    },
    password: process.env['REDIS_PASS']!
})
try {
    await Redis.connect()
} catch (e) {
    throw e
}
export default Redis