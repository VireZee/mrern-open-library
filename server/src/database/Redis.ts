import { Redis } from 'ioredis'

const RedisConnection = new Redis({
    host: process.env['DB_HOST']!,
    password: process.env['REDIS_PASS']!
})
export default RedisConnection