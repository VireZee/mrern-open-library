const generateSvg = (name: string) => {
    const initials = name.split(' ').map(w => w.charAt(0).toUpperCase()).slice(0, 5).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
            <circle cx="256" cy="256" r="256" fill="#000" />
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman" font-size="128" fill="white">${initials}</text>
        </svg>
    `
    return Buffer.from(svg).toString('base64')
}
export default generateSvg