import type { FC, ChangeEvent, FormEvent } from 'react'
import { useMutation, ApolloError } from '@apollo/client'
import REGISTER from '@features/auth/mutations/Register'
import { useSelector, useDispatch } from 'react-redux'
import { change, setShow, setErrors } from '@store/slices/auth/register'
import type { RootState } from '@store/store'
import type BaseError from '@type/redux/auth/baseError'

const Register: FC = () => {
    const [register, { loading }] = useMutation(REGISTER)
    const dispatch = useDispatch()
    const registerState = useSelector((state: RootState) => state.register)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        dispatch(change({ name, value }))
        dispatch(setErrors({ ...registerState.errors, [name]: '' }))
    }
    const toggle = () => dispatch(setShow(!registerState.show))
    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await register({
                variables: {
                    name: registerState.name,
                    username: registerState.username,
                    email: registerState.email,
                    pass: registerState.pass,
                    rePass: registerState.show ? null : registerState.rePass,
                    show: registerState.show,
                }
            })
            if (data.register) location.href = '/verify'
        } catch (e) {
            if (e instanceof ApolloError) {
                const { errs } = e.cause!.extensions as { errs: BaseError }
                dispatch(setErrors(errs))
            } else alert('An unexpected error occurred.')
        }
    }
    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                <h1 className="flex justify-center text-2xl font-semibold mb-4">Register</h1>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={registerState.name}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!registerState.errors.name ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {registerState.errors.name && <p className="text-red-500 text-sm mt-1">{registerState.errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={registerState.username}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!registerState.errors.username ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {registerState.errors.username && <p className="text-red-500 text-sm mt-1">{registerState.errors.username}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={registerState.email}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!registerState.errors.email ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {registerState.errors.email && <p className="text-red-500 text-sm mt-1">{registerState.errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={registerState.show ? "text" : "password"}
                                name="pass"
                                value={registerState.pass}
                                onChange={handleChange}
                                className={`mt-1 p-2 border ${!registerState.errors.pass ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                            />
                            <button
                                type="button"
                                onClick={toggle}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                            >
                                {registerState.show ? (
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
                        {registerState.errors.pass && <p className="text-red-500 text-sm mt-1">{registerState.errors.pass}</p>}
                    </div>
                    {!registerState.show && (
                        <div className="mb-4">
                            <label className="text-md text-gray-700">Retype Password</label>
                            <input
                                type="password"
                                name="rePass"
                                value={registerState.rePass}
                                onChange={handleChange}
                                className={`mt-1 p-2 border ${!registerState.errors.rePass ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                            />
                            {registerState.errors.rePass && <p className="text-red-500 text-sm mt-1">{registerState.errors.rePass}</p>}
                        </div>
                    )}
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
                </form>
                <div className="mt-4 text-sm text-gray-700 text-center">
                    Already have an account? <a href="/login" className="font-medium text-black hover:text-black">Log In</a>
                </div>
            </div>
        </div>
    )
}
export default Register