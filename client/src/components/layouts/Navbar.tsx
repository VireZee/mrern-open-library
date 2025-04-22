import { useEffect } from 'react'
import type { FC, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, ApolloError } from '@apollo/client'
import LOGOUT from '@features/auth/mutations/Logout'
import { useSelector, useDispatch } from 'react-redux'
import { setActive, setIsDropdownOpen } from '@store/slices/layouts/navbar'
import type { RootState } from '@store/store'

interface Props {
    isUser: {
        photo: string
        name: string
    } | null
    onSearch: (v: string) => void
}
const Navbar: FC<Props> = ({ isUser, onSearch }) => {
    const [logout] = useMutation(LOGOUT)
    const dispatch = useDispatch()
    const navbarState = useSelector((state: RootState) => state.navbar)
    const { title, isbn } = Object.fromEntries(new URLSearchParams(window.location.search))
    const str = title || isbn
    useEffect(() => {
        const path = window.location.pathname
        if (path === '/collection') dispatch(setActive('col'))
        else if (path === '/API') dispatch(setActive('api'))
    }, [])
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSearch(e.currentTarget.value)
    }
    const imgFormat = (base64String: string) => {
        const decodedString = atob(base64String)
        const hexString = Array.from(decodedString).map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('')
        if (decodedString.trim().startsWith('<?xml') || decodedString.trim().startsWith('<svg')) return 'svg+xml'
        else if (hexString.startsWith('FFD8FF')) return 'jpeg'
        else if (hexString.startsWith('89504E470D0A1A0A')) return 'png'
        else if (hexString.startsWith('474946383761') || hexString.startsWith('474946383961')) return 'gif'
        return
    }
    const handleLogOut = async () => {
        try {
            const { data } = await logout()
            if (data.logout) location.href = '/'
        } catch (err) {
            if (err instanceof ApolloError) alert(err.message)
            else alert('An unexpected error occurred.')
        }
    }
    return (
        <nav className="flex flex-wrap justify-between items-center p-4 md:px-7 h-auto bg-[#282820] w-full fixed top-0 left-0 z-50 shadow-md">
            <div className="text-white">
                {isUser ? (
                    <div className="flex flex-wrap space-x-4">
                        <Link to="" className={`${navbarState.active === 'home' ? 'text-gray-500' : 'hover:text-gray-500'} mr-4`} onClick={() => dispatch(setActive('home'))}>Home</Link>
                        <Link to="collection" className={`${navbarState.active === 'col' ? 'text-gray-500' : 'hover:text-gray-500'} mr-4`} onClick={() => dispatch(setActive('col'))}>Collection</Link>
                        <Link to="API" className={`${navbarState.active === 'api' ? 'text-gray-500' : 'hover:text-gray-500'}`} onClick={() => dispatch(setActive('api'))}>API</Link>
                    </div>
                ) : (
                    <Link to="" className='text-gray-500'>Home</Link>
                )}
            </div>
            {navbarState.active !== 'api' && (
                <input placeholder={navbarState.active === 'home' ? 'Search Title or ISBN (without "-" or spaces)' : 'Search Title'} className="bg-white w-full md:w-[25vw] p-2 rounded-full mt-2 md:mt-0" defaultValue={str} onKeyDown={handleKeyDown} />
            )}
            <div className="w-full flex flex-col items-center mt-4 md:mt-0 md:w-auto md:flex-row md:justify-end">
                {isUser ? (
                    <>
                        <span className="hidden md:inline text-white mr-4">{isUser.name}</span>
                        <img src={`data:image/${imgFormat(isUser.photo)};base64,${isUser.photo}`} alt="Image" className="rounded-full w-12 h-12 mx-auto cursor-pointer" onClick={() => dispatch(setIsDropdownOpen(!navbarState.isDropdownOpen))} />
                        {navbarState.isDropdownOpen && (
                            <div className="absolute top-12 right-0 bg-white text-black shadow-md rounded-md w-40">
                                <ul>
                                    <li className="p-2 hover:bg-gray-200 cursor-pointer"><a href="settings">Settings</a></li>
                                    <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogOut}>Log Out</li>
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <a href="register" className="hover:text-gray-500 mr-4 text-white">Register</a>
                        <a href="login" className="hover:text-gray-500 text-white">Already have an account?</a>
                    </>
                )}
            </div>
        </nav>
    )
}
export default Navbar