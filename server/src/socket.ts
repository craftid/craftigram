import debug from "debug"
import { Server } from "socket.io"

import { IUser } from "./model/user.model"

debug.enable("express:socket")

const log = debug("express:socket")

export interface IUserWithSocket extends IUser {
	socketId: string
}

export let users: IUserWithSocket[] = []

let io: Server

export const addUser = (userData: any, socketId: string) => {
	!users.some((user) => user._id.toString() === userData.sub) &&
		users.push({ ...userData, socketId })
	log("user connected", socketId)
}

export const removeUser = (socketId: string) => {
	users = users.filter((user) => user.socketId !== socketId)
	log("remove user", socketId)
}

export const getUser = (userId: string) => {
	log("get user", userId)
	return users.find((user) => user._id.toString() === userId)
}

export const setupSocket = (server: any) => {
	log("setting up socket")

	io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	})

	io.on("connection", (socket) => {
		log("client connected", socket.id)
		const userId = socket.handshake.query.userId
		if (userId) {
			addUser({ _id: userId }, socket.id)
		}
		socket.on("getOnlineUsers", () => {
			io.emit("getUsers", users)
		})

		socket.on("sendMessage", (message) => {
			const user = getUser(message.receiverId)
			if (!user) {
				log("user not found")
				return
			}
			io.to(user.socketId).emit("getMessage", message)
		})

		socket.on("disconnect", () => {
			removeUser(socket.id)
			log("client disconnected", socket.id)
			io.emit("getUsers", users)
		})
	})
}

export const getSocket = () => {
	if (!io) throw new Error("Socket.io not initialized")
	return io
}
