import path from "path"
import { defineConfig } from 'vite'
import { config } from "dotenv"
import react from '@vitejs/plugin-react'

// // Load environment variables from .env file
config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        host: true       
    },
    define:{
        'process.env': process.env
    }
})
