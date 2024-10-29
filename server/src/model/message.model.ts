import { model, Schema } from "mongoose"

const messageSchema = new Schema({
	senderId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	receiverId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	message: {
		type: String,
		required: true,
	},
})

export const Message = model("Message", messageSchema)

export interface IMessage {
	senderId: Schema.Types.ObjectId
	receiverId: Schema.Types.ObjectId
	message: string
}
