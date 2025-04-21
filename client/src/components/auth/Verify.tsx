import type { FormEvent } from 'react'
import React from 'react'
import { useMutation, ApolloError } from '@apollo/client'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/index'
import { change, setError } from '../../store/slices/auth/verify'
import VERIFY from '@features/auth/mutations/Verify'
import RESEND from '@features/auth/mutations/Resend'

const Verify: React.FC = () => {
    const [verify, { loading: verLoad }] = useMutation(VERIFY)
    const [resend, { loading: resLoad }] = useMutation(RESEND)
    const dispatch = useDispatch()
    const verState = useSelector((state: RootState) => state.VER)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        dispatch(change({ name, value }))
        dispatch(setError(''))
    }
    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await verify({ variables: { code: verState.code } })
            if (data.verify) location.href = '/'
        } catch (err) {
            if (err instanceof ApolloError) dispatch(setError(err.message))
            else alert('An unexpected error occurred.')
        }
    }
    const resendCode = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await resend()
            if (data.resend) dispatch(setError('Code has been sent!'))
        } catch (err) {
            if (err instanceof ApolloError) dispatch(setError(err.message))
            else alert('An unexpected error occurred.')
        }
    }
    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                <h1 className="flex justify-center text-2xl font-semibold mb-4">Verify Your Email</h1>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Code</label>
                        <input
                            type="text"
                            name="code"
                            value={verState.code}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!verState.errors ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {verState.error && <p className="text-red-500 text-sm mt-1">{verState.error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md" disabled={verLoad} >{verLoad ? 'Loading...' : 'Verify'}</button>
                    <button type="button" className="w-full bg-black text-white py-2 px-4 rounded-md mt-1" disabled={resLoad} onClick={resendCode}>{resLoad ? 'Loading...' : 'Resend Code'}</button>
                </form>
            </div>
        </div>
    )
}
export default Verify