export type Errors = {
    name?: string
    uname?: string
    email?: string
    pass?: string
    rePass?: string
}
export type State = {
    [key: string]: string | boolean | Errors
}