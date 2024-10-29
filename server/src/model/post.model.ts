import { model, Schema } from "mongoose"

const postSchema = new Schema({
	caption: { type: String, default: "" },
	image: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
})

export const Post = model("Post", postSchema)

export interface IPost {
	caption?: string
	image: string
	author: Schema.Types.ObjectId
	likes: Schema.Types.ObjectId[]
	comments: Schema.Types.ObjectId[]
}
