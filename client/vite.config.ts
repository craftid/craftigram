import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
		},
	},
	server: {
		host: true,
		// if dev, proxy to server on port 3000
		proxy: {
			"/api": "http://localhost:3000",
			// websocket proxy for socket.io
			"/socket.io": {
				target: "http://localhost:3000",
			},
		},
	},
})
