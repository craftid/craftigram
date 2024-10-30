// client/src/middleware/socketMiddleware.ts
import { Middleware } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client"

import { setOnlineUsers } from "../redux/chat-slice"
import { setLikeNotification } from "../redux/rtn-slice"

let socket: Socket | null = null

const socketMiddleware: Middleware<Rootstate> = (store) => {
	return (next) => (action) => {
		if (action.type === "auth/setAuthUser") {
			const user = action.payload
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
			} else if (socket) {
				socket.close()
				socket = null
			}
		}

		next(action)
	}
}

export default socketMiddleware
