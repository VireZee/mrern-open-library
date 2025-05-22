import type { FC, ChangeEvent, FormEvent } from 'react'
import { useMutation, ApolloError } from '@apollo/client'
import VERIFY from '@features/auth/mutations/Verify'
import RESEND from '@features/auth/mutations/Resend'
import { useSelector, useDispatch } from 'react-redux'
import { change, setError } from '@store/slices/auth/verify'
import type { RootState } from '@store/store'

const Verify: FC = () => {
    const [verify, { loading: verifyLoad }] = useMutation(VERIFY)
    const [resend, { loading: resendLoad }] = useMutation(RESEND)
    const dispatch = useDispatch()
    const verifyState = useSelector((state: RootState) => state.verify)
    const { code, error } = verifyState
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        dispatch(change({ name, value }))
        dispatch(setError(''))
    }
    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await verify({ variables: { code } })
            if (data.verify) location.href = '/'
        } catch (e) {
            if (e instanceof ApolloError) dispatch(setError(e.message))
            else alert('An unexpected error occurred.')
        }
    }
    const resendCode = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await resend()
            if (data.resend) dispatch(setError('Code has been sent!'))
        } catch (e) {
            if (e instanceof ApolloError) dispatch(setError(e.message))
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
                            value={code}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!error ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md" disabled={verifyLoad} >{verifyLoad ? 'Loading...' : 'Verify'}</button>
                    <button type="button" className="w-full bg-black text-white py-2 px-4 rounded-md mt-1" disabled={resendLoad} onClick={resendCode}>{resendLoad ? 'Loading...' : 'Resend Code'}</button>
                </form>
            </div>
        </div>
    )
}
export default Verify