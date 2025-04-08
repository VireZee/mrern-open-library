export const sanitize = (id: string) => `${id.replace(/[^a-zA-Z0-9_@.-]/g, '')}`
export const sanitizeRedisKey = (type: 'user' | 'verify' | 'resend' | 'book' | 'collection', key: string) => `${type}:${key.replace(/[^a-zA-Z0-9_@.-]/g, '')}`