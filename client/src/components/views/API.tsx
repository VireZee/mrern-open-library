import { useEffect } from 'react'
import type { FC } from 'react'
import { useQuery, useMutation, ApolloError } from '@apollo/client'
import CHECK from '@features/api/queries/Check'
import GENERATE from '@features/api/mutations/Generate'
import { useSelector, useDispatch } from 'react-redux'
import { setOnline, setApiKey } from '@store/slices/views/apis'
import type { RootState } from '@store/store'
import Net from '@components/common/NoInternet'

const API: FC = () => {
    const { loading, data, error } = useQuery(CHECK)
    const [generate] = useMutation(GENERATE)
    const dispatch = useDispatch()
    const apiState = useSelector((state: RootState) => state.API)
    useEffect(() => {
        const handleOnline = () => dispatch(setOnline(navigator.onLine))
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOnline)
        check()
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOnline)
        }
    }, [apiState.online, data, error])
    const check = async () => {
        if (!loading) {
            if (data) dispatch(setApiKey(data.check))
            else if (error) alert(error)
        }
    }
    const generateApi = async () => {
        try {
            const { data } = await generate()
            if (data) dispatch(setApiKey(data.generate))
        } catch (err) {
            if (err instanceof ApolloError) alert(err.message)
            else alert('An unexpected error occurred.')
        }
    }
    return (
        <>
            {apiState.online ? (
                <div className="mt-16">
                    {apiState.apiKey !== null ? (
                        <p className="bg-black text-white px-4 py-3 rounded-lg w-[90vw] max-w-[600px] text-center break-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-xl">http://{import.meta.env['VITE_DOMAIN']}:{import.meta.env['VITE_SERVER_PORT']}/api/{apiState.apiKey}</p>
                    ) : (
                        <button
                            onClick={generateApi}
                            className="bg-black text-white px-6 py-3 rounded-lg text-lg sm:text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            Generate
                        </button>
                    )}
                </div>
            ) : (
                <Net />
            )}
        </>
    )
}
export default API