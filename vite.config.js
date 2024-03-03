import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            'config': '/config.js',
            'modules': '/src/modules',
            'utils': '/src/utils'
        }
    },
    build: {
        target: 'es2020',
        outDir: './dist',
        assetsDir: './',
        emptyOutDir: false,
        rollupOptions: {
            input: './src/main.js',
            output: {
                entryFileNames: 'shellshocked.min.js',
                compact: true
            }
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