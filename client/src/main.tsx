import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import store from '@store/store'
import App from './App'

const client = new ApolloClient({
    uri: `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/gql`,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'MRERNOpenLibraryGraphQL',
        'apollo-require-preflight': 'true'
    },
    cache: new InMemoryCache({ addTypename: false })
})
createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <App />
        </Provider>
    </ApolloProvider>
)