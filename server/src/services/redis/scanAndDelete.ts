import Redis from '@database/Redis.ts'
export default async (key: string) => {
    let cursor = 0
    do {
        const result = await Redis.SCAN(cursor, {
            MATCH: key,
            COUNT: 100
        })
        cursor = result.cursor
        if (result.keys.length) await Redis.DEL(result.keys)
    } while (cursor !== 0)
}