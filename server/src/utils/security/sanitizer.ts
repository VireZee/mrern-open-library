export const sanitize = (id: string) => `${id.replace(/[^a-zA-Z0-9|]/g, '')}`
export const sanitizeRedisKey = (name: string, key: ObjectId | string) => `${name}:${sanitize(key.toString())}`