import type { FC, ChangeEvent, FormEvent } from 'react'
import { useMutation, ApolloError } from '@apollo/client'
import FORGET from '@features/auth/mutations/Forget'
import { useSelector, useDispatch } from 'react-redux'
import { change, setError } from '@store/slices/auth/forget'
import type { RootState } from '@store/store'

const Forget: FC = () => {
    const [forget, { loading }] = useMutation(FORGET)
    const dispatch = useDispatch()
    const forgetState = useSelector((state: RootState) => state.forget)
    const { email, error } = forgetState
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        dispatch(change({ name, value }))
        dispatch(setError(''))
    }
    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await forget({ variables: { email } })
            if (data.forget) dispatch(setError(data.forget))
        } catch (e) {
            if (e instanceof ApolloError) dispatch(setError(e.message))
            else alert('An unexpected error occurred.')
        }
    }
    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                <h1 className="flex justify-center text-2xl font-semibold mb-4">Forget Password</h1>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="text-md text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className={`mt-1 p-2 border ${!error ? 'border-gray-300' : 'border-red-500'} rounded-md w-full focus:outline-none focus:border-black`}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md" disabled={loading} >{loading ? 'Loading...' : 'Send'}</button>
                </form>
            </div>
        </div>
    )
}
export default Forget