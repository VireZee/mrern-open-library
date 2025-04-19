import { useEffect } from 'react'
import type { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import AuthGQL from '@features/auth/queries/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setVerified, setSearch } from '@store/slices/core/App'
import type { RootState } from '@store/index'
import '@assets/styles/global.css'
import Navbar from '@components/layouts/Navbar'
import Home from '@components/views/Home'
import Register from '@components/auth/Register'
import Verify from '@components/auth/Verify'
import Login from '@components/auth/Login'
import Collection from '@components/views/Collection'
import API from '@components/views/API'
import Settings from '@components/auth/Settings'
import NotFound from '@components/common/NotFound'
import Main from '@routes/Main'
import Protected from '@routes/Protected'
import Auth from '@routes/Auth'
import VerifyRoute from '@routes/Verified'
import Load from '@components/common/Load'

const App: FC = () => {
    const { loading, data, error } = useQuery(AuthGQL)
    const dispatch = useDispatch()
    const appState = useSelector((state: RootState) => state.APP)
    const showBackLink = ['/register', '/verify', '/login'].includes(location.pathname)
    const hideHeader = location.pathname === '/settings'
    const searchHandler = (s: string) => dispatch(setSearch(s))
    useEffect(() => {
        if (!loading) {
            if (data) {
                dispatch(setUser(data.auth))
                dispatch(setVerified(data.auth.verified))
            }
            else if (error) dispatch(setUser(null))
        }
    }, [data, error])
    if (loading) return <Load />
    return (
        <BrowserRouter>
            {!hideHeader && (
                <header className="fixed w-screen">
                    {showBackLink ? (
                        <a href="/" className="absolute top-4 left-4 text-[1.2rem] text-white no-underline">&#8592; Back to home</a>
                    ) : (
                        <Navbar isUser={appState.user} onSearch={searchHandler} />
                    )}
                </header>
            )}
            <main>
                <Routes>
                    <Route element={<Main user={appState.user} verified={appState.verified} />}>
                        <Route path='/' element={<Home isUser={appState.user} search={appState.search} />} />
                    </Route>
                    <Route element={<Auth verified={appState.verified} />}>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                    </Route>
                    <Route element={<VerifyRoute verified={appState.verified} />}>
                        <Route path='/verify' element={<Verify />} />
                    </Route>
                    <Route element={<Protected user={appState.user} verified={appState.verified} />}>
                        <Route path='collection' element={<Collection search={appState.search} />} />
                        <Route path='API' element={<API />} />
                        <Route path='settings' element={<Settings isUser={appState.user} />} />
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}
export default App