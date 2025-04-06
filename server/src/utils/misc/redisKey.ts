const getRedisKey = (key: 'user' | 'verify' | 'resend' | 'book' | 'collection', id: string) => `${key}:${id}`
export default getRedisKey