import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store/index'
import { setUser, setVerified, setSearch } from './store/slices/core/App'
import AuthGQL from './graphql/queries/auth/Auth'
import './assets/styles/global.css'
import Nav from './components/layouts/Navbar'
import Home from './components/views/Home'
import Reg from './components/auth/Register'
import Ver from './components/auth/Verify'
import Log from './components/auth/Login'
import Col from './components/views/Collection'
import API from './components/views/API'
import Set from './components/auth/Settings'
import NF from './components/common/NotFound'
import ProtectedRoute from './ProtectedRoute'
import Load from './components/common/Load'

const App: React.FC = () => {
    const { loading, data, error } = useQuery(AuthGQL)
    const dispatch = useDispatch()
    const appState = useSelector((state: RootState) => state.APP)
    const showBackLink = ['/register', '/verify', '/login'].includes(location.pathname)
    const hideHeader = location.pathname === '/settings'
    const searchHandler = (s: string) => dispatch(setSearch(s))
    React.useEffect(() => {
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
                        <Nav isUser={appState.user} onSearch={searchHandler} />
                    )}
                </header>
            )}
            <main>
                <Routes>
                    <Route path='' element={<Home isUser={appState.user} search={appState.search} />} />
                    <Route path='register' element={!appState.user ? <Reg /> : <Navigate to='/' />} />
                    <Route path='login' element={!appState.user ? <Log /> : <Navigate to='/' />} />
                    <Route path='verify' element={appState.user && !appState.verified ? <Ver /> : <Navigate to="/" />} />
                    <Route element={<ProtectedRoute user={appState.user} verified={appState.verified} />}>
                        <Route path='collection' element={<Col search={appState.search} />} />
                        <Route path='API' element={<API />} />
                        <Route path='settings' element={<Set isUser={appState.user} />} />
                    </Route>
                    <Route path='*' element={<NF />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}
export default App