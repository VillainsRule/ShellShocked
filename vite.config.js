import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'es2020',
        outDir: './dist',
        assetsDir: './',
        rollupOptions: {
            input: './src/main.js'
        },
        minify: 'terser',
        terserOptions: {
            format: {
                comments: false
            },
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                toplevel: true,
                unsafe: true,
                drop_console: false,
                unsafe_comps: true,
                passes: 2
            },
            module: true
        }
    }
});