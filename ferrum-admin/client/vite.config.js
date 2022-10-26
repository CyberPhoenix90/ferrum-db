import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/ws': {
                target: 'ws://localhost:8080',
                changeOrigin: true,
                ws: true,
            },
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});
