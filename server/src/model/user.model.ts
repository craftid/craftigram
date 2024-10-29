import { model, Schema } from "mongoose"

const userSchema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: { type: String, default: "" },
		bio: { type: String, default: "" },
		gender: { type: String, enum: ["male", "female"] },
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
		bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
	},
	{ timestamps: true }
)

export const User = model("User", userSchema)

export interface IUser {
	_id: Schema.Types.ObjectId
	username: string
	email: string
	password: string
	profilePicture?: string
	bio?: string
	gender?: "male" | "female"
	followers: Schema.Types.ObjectId[]
	following: Schema.Types.ObjectId[]
	posts: Schema.Types.ObjectId[]
	bookmarks: Schema.Types.ObjectId[]
}
