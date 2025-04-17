export const sanitize = (id: string) => `${id.replace(/[^a-zA-Z0-9_@.-]/g, '')}`
export const sanitizeRedisKey = (name: string, key: string) => `${name}:${sanitize(key)}`