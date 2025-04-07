export default (type: 'user' | 'verify' | 'resend' | 'book' | 'collection', key: string) => `${type}:${key.replace(/[^a-zA-Z0-9_@.-]/g, '')}`