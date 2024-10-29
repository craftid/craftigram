import type { Response } from "express"

import { Conversation } from "../model/conversation.model"
import { Message } from "../model/message.model"
import type { CustomRequest } from "../server"
import { getSocket, getUser } from "./../socket"

// for chatting
export const sendMessage = async (req: CustomRequest, res: Response) => {
	try {
		const senderId = req.id
		const receiverId = req.params.id
		const { textMessage: message } = req.body

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		})
		// establish the conversation if not started yet.
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			})
		}
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message,
		})
		if (newMessage) conversation.messages.push(newMessage._id)

		await Promise.all([conversation.save(), newMessage.save()])

		// implement socket io for real time data transfer
		const receiverSocketId = getUser(receiverId)
		if (receiverSocketId) {
			getSocket().to(receiverSocketId.socketId).emit("newMessage", newMessage)
		}

		res.status(201).json({
			success: true,
			newMessage,
		})
		return
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: "Internal server error",
		})
		return
	}
}

export const getMessage = async (req: CustomRequest, res: Response) => {
	try {
		const senderId = req.id
		const receiverId = req.params.id
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		}).populate("messages")
		if (!conversation) {
			res.status(200).json({ success: true, messages: [] })
			return
		}

		res.status(200).json({ success: true, messages: conversation?.messages })
		return
	} catch (error) {
		console.log(error)
	}
}
