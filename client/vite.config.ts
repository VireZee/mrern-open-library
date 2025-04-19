import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': '/src/components',
            '@features': '/src/features',
            '@store': '/src/store',
            '@routes': '/src/routes',
            '@assets': '/src/assets',
            '@type': '/src/types',
        },
    }
})