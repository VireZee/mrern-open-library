import { createClient } from 'redis'

const Redis = createClient({
    password: process.env['REDIS_PASS']!,
    socket: {
        host: process.env['DB_HOST'],
        port: Number(process.env['REDIS_PORT'])
    }
})
try {
    await Redis.connect()
} catch (e) {
    throw e
}
export default Redis