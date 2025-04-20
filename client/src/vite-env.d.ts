/// <reference types="vite/client" />
type ImportMetaEnv = {
    readonly VITE_DOMAIN: string
    readonly VITE_SERVER_PORT: string
}
type ImportMeta = {
    readonly env: ImportMetaEnv
}