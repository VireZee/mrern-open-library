export const validateName = (name: string) => {
    if (!name) {
        return "Name can't be empty!"
    } else if (name.length >= 75) {
        return 'Name is too long!'
    }
    return
}
export const formatName = (name: string) => {
    const nameParts = name.split(' ')
    const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    return name = initials.join(' ')
}