import socketMiddleware from "@/middleware/socketMiddleware"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import authSlice from "./auth-slice"
import chatSlice from "./chat-slice"
import postSlice from "./post-slice"
import rtnSlice from "./rtn-slice"
import socketSlice from "./socket-slice"

const persistConfig = {
	key: "root",
	version: 1,
	storage,
}

const rootReducer = combineReducers({
	auth: authSlice,
	chat: chatSlice,
	post: postSlice,
	socketio: socketSlice,
	realTimeNotification: rtnSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(socketMiddleware),
})

export default store

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch
