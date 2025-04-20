import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import Store from '@store/index'
import App from '@src/App'

const Client = new ApolloClient({
    uri: `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_SERVER_PORT}/gql`,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'MRERNOpenLibraryGraphQL',
        'apollo-require-preflight': 'true'
    },
    cache: new InMemoryCache({ addTypename: false })
})
ReactDOM.createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={Client}>
        <Provider store={Store}>
            <App />
        </Provider>
    </ApolloProvider>
)