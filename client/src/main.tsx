import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

import App from "./App.tsx"
import { Toaster } from "./components/ui/sonner"
import store from "./redux/store"

import "./main.css"

import { ThemeProvider } from "@/theme-provider.tsx"

const reduxPersistor = persistStore(store)

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<PersistGate loading={null} persistor={reduxPersistor}>
					<App />
					<Toaster />
				</PersistGate>
			</ThemeProvider>
		</Provider>
	</StrictMode>
)
