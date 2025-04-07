export const formatUserResponse = (userData: { photo: Buffer, name: string, username: string, email: string, verified: boolean }) => ({
    photo: Buffer.from(userData.photo).toString('base64'),
    name: userData.name,
    uname: userData.username,
    email: userData.email,
    verified: userData.verified
})