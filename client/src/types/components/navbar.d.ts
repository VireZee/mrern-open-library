type NavbarProps = {
    isUser: {
        photo: string
        name: string
    } | null
    onSearch: (v: string) => void
}
export default NavbarProps