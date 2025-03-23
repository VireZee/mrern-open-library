import React from 'react'
import { useMutation, ApolloError } from '@apollo/client'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/index'
import type { Errors } from '../../store/slices/auth/Settings'
import { setIsDropdownOpen, change, setShow, setErrors } from '../../store/slices/auth/Settings'
import { SETTINGS as SettingsGQL, DELETE as DeleteGQL } from '../../graphql/mutations/auth/Settings'

interface Props {
    isUser: {
        photo: string
        name: string
        uname: string
        email: string
    }
}
const Settings: React.FC<Props> = ({ isUser }) => {
    const [settings, { loading: setLoad }] = useMutation(SettingsGQL)
    const [terminate, { loading: delLoad }] = useMutation(DeleteGQL)
    const dispatch = useDispatch()
    const setState = useSelector((state: RootState) => state.SET)
    React.useEffect(() => {
        dispatch(change({ name: 'photo', value: isUser.photo }))
        dispatch(change({ name: 'name', value: isUser.name }))
        dispatch(change({ name: 'uname', value: isUser.uname }))
        dispatch(change({ name: 'email', value: isUser.email }))
    }, [isUser])
    const inputFileRef = React.useRef<HTMLInputElement>(null)
    const imgFormat = (base64String: string) => {
        const decodedString = atob(base64String)
        const hexString = Array.from(decodedString).map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('')
        if (decodedString.trim().startsWith('<?xml') || decodedString.trim().startsWith('<svg')) return 'svg+xml'
        else if (hexString.startsWith('FFD8FF')) return 'jpeg'
        else if (hexString.startsWith('89504E470D0A1A0A')) return 'png'
        else if (hexString.startsWith('474946383761') || hexString.startsWith('474946383961')) return 'gif'
        return
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (!file) return
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64String = reader.result!.toString().split(',')[1]
            const format = imgFormat(base64String!)
            if (format) dispatch(change({ name: 'photo', value: base64String! }))
            else alert('Invalid file format. Please upload an JPG/JPEG, PNG, GIF, or SVG image!')
        }
        dispatch(setErrors({ ...setState.errors, photo: '' }))
    }
    const removeImage = () => {
        const initials = setState.name.split(' ').map((w: string) => w.charAt(0).toUpperCase()).slice(0, 5).join('')
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
            <circle cx="256" cy="256" r="256" fill="#000" />
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman" font-size="128" fill="white">${initials}</text>
        </svg>`
        dispatch(change({ name: 'photo', value: btoa(svg) }))
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        dispatch(change({ name, value }))
        dispatch(setErrors({ ...setState.errors, [name]: '' }))
    }
    const toggle = (name: 'old' | 'new') => dispatch(setShow({ ...setState.show, [name]: !setState.show[name] }))
    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await settings({
                variables: {
                    photo: setState.photo,
                    name: setState.name,
                    uname: setState.uname,
                    email: setState.email,
                    oldPass: setState.oldPass,
                    newPass: setState.newPass,
                    rePass: setState.show['new'] ? null : setState.rePass,
                    show: setState.show['new']
                }
            })
            if (data.settings) {
                alert('Changes saved!')
                location.href = '/'
            }
        } catch (err) {
            if (err instanceof ApolloError) {
                const GQLErr = err.cause!.extensions as { errs: Errors }
                dispatch(setErrors(GQLErr.errs))
            } else alert('An unexpected error occurred.')
        }
    }
    const handleDeleteAccount = async () => {
        try {
            const { data } = await terminate()
            if (data.delete) {
                alert('Account deleted!')
                location.href = '/'
            }
        } catch (err) {
            if (err instanceof ApolloError) alert(err.message)
            else alert('An unexpected error occurred.')
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center mb-4">Settings</h2>
                <form onSubmit={submit}>
                    <div className="relative flex justify-center mb-6">
                        <img src={`data:image/${imgFormat(setState.photo)};base64,${setState.photo}`} alt="Image" className="rounded-full w-72 h-72 cursor-pointer object-cover" onClick={() => dispatch(setIsDropdownOpen(!setState.isDropdownOpen))} />
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/svg+xml"
                            ref={inputFileRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {setState.isDropdownOpen && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black shadow-md rounded-md w-40 z-50">
                                <ul className="text-center">
                                    <li
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            inputFileRef.current!.click()
                                            dispatch(setIsDropdownOpen(false))
                                        }}
                                    >
                                        Upload Image
                                    </li>
                                    <li
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            removeImage()
                                            dispatch(setIsDropdownOpen(false))
                                        }}
                                    >
                                        Remove Image
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {setState.errors.photo && <p className="text-red-500 text-sm mt-1 text-center">{setState.errors.photo}</p>}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded-md mt-1"
                            value={setState.name}
                            onChange={handleChange}
                        />
                        {setState.errors.name && <p className="text-red-500 text-sm mt-1">{setState.errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Username</label>
                        <input
                            type="text"
                            name="uname"
                            className="w-full p-2 border rounded-md mt-1"
                            value={setState.uname}
                            onChange={handleChange}
                        />
                        {setState.errors.uname && <p className="text-red-500 text-sm mt-1">{setState.errors.uname}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 border rounded-md mt-1"
                            value={setState.email}
                            onChange={handleChange}
                        />
                        {setState.errors.email && <p className="text-red-500 text-sm mt-1">{setState.errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Change Password</label>
                        <div className="relative">
                            <input
                                type={setState.show['old'] ? "text" : "password"}
                                name="oldPass"
                                placeholder="Old Password"
                                className="w-full p-2 border rounded-md mt-1"
                                value={setState.oldPass}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => toggle('old')}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                            >
                                {setState.show['old'] ? (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {setState.errors.oldPass && <p className="text-red-500 text-sm mt-1">{setState.errors.oldPass}</p>}
                        <div className="relative">
                            <input
                                type={setState.show['new'] ? "text" : "password"}
                                name="newPass"
                                placeholder="New Password"
                                className="w-full p-2 border rounded-md mt-1"
                                value={setState.newPass}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => toggle('new')}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                            >
                                {setState.show['new'] ? (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {setState.errors.newPass && <p className="text-red-500 text-sm mt-1">{setState.errors.newPass}</p>}
                        {!setState.show['new'] && (
                            <>
                                <input
                                    type="password"
                                    name="rePass"
                                    placeholder="Retype New Password"
                                    className="w-full p-2 border rounded-md mt-1"
                                    value={setState.rePass}
                                    onChange={handleChange}
                                />
                                {setState.errors.rePass && <p className="text-red-500 text-sm mt-1">{setState.errors.rePass}</p>}
                            </>
                        )}
                    </div>
                    <button className="w-full p-2 bg-black text-white rounded-md mt-5" disabled={setLoad}>
                        {setLoad ? 'Loading...' : 'Save Changes'}
                    </button>
                    <button className="w-full p-2 bg-red-500 text-white rounded-md mt-5" onClick={handleDeleteAccount} disabled={delLoad}>Delete Account</button>
                </form>
            </div>
        </div>
    )
}
export default Settings