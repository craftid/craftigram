// client/src/middleware/socketMiddleware.ts
import { Middleware } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client"

import { setOnlineUsers } from "../redux/chat-slice"
import { setLikeNotification } from "../redux/rtn-slice"
import { RootState } from "../redux/store"

let socket: Socket | null = null

const socketMiddleware: Middleware<
	{
		dispatch: any
		getState: () => RootState
	},
	RootState
> = (store) => (next) => (action) => {
	if (
		typeof action === "object" &&
		action !== null &&
		"type" in action &&
		action.type === "auth/setAuthUser"
	) {
		const user = (action as { type: string; payload: any }).payload
		if (user) {
			const env = import.meta.env.NODE_ENV
			socket = io(
				env === "development"
					? "http://localhost:5173"
					: import.meta.env.PUBLIC_URL,
				{
					query: {
						userId: user._id,
					},
				}
			)

			socket.on("getOnlineUsers", (onlineUsers) => {
				store.dispatch(setOnlineUsers(onlineUsers))
			})

			socket.on("notification", (notification) => {
				store.dispatch(setLikeNotification(notification))
			})

			socket.on("newMessage", (newMessage) => {
				const state = store.getState()
				const messages = state.chat.messages
				store.dispatch(setMessages([...messages, newMessage]))
			})
		} else if (socket) {
			socket.close()
			socket = null
		}
	}

	return next(action)
}

export default socketMiddleware
