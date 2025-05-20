type NavbarProps = {
    isUser: {
        photo: string
        name: string
    } | null
    onSearch: (query: string) => void
}
export default NavbarProps