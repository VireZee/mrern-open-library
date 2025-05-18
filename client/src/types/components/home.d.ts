export type HomeProps = {
    search: string
    isUser: Record<string, string> | null
}
export type BooksData = {
    numFound: number
    docs: Books[]
}