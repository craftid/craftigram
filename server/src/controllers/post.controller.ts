import type { Response } from "express"
import sharp from "sharp"

import { Comment } from "../model/comment.model"
import { Post } from "../model/post.model"
import { User } from "../model/user.model"
import type { CustomRequest } from "../server"
import { getSocket, getUser } from "../socket"
import cloudinary from "../utils/cloudinary"

export const addNewPost = async (req: CustomRequest, res: Response) => {
	try {
		const { caption } = req.body
		const image = req.file
		const authorId = req.id

		if (!image) {
			res.status(400).json({ message: "Image required" })
			return
		}

		// image upload
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({ width: 800, height: 800, fit: "inside" })
			.toFormat("jpeg", { quality: 80 })
			.toBuffer()

		// buffer to data uri
		const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`
		const cloudResponse = await cloudinary.uploader.upload(fileUri)
		const post = await Post.create({
			caption,
			image: cloudResponse.secure_url,
			author: authorId,
		})
		const user = await User.findById(authorId)
		if (user) {
			user.posts.push(post._id)
			await user.save()
		}

		await post.populate({ path: "author", select: "-password" })

		res.status(201).json({
			message: "New post added",
			post,
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}

export const getAllPost = async (req: CustomRequest, res: Response) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({ path: "author", select: "username profilePicture" })
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "username profilePicture",
				},
			})
			.sort({ "comments.createdAt": -1 })
		res.status(200).json({
			posts,
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}

export const getUserPost = async (req: CustomRequest, res: Response) => {
	try {
		const authorId = req.id
		const posts = await Post.find({ author: authorId })
			.sort({ createdAt: -1 })
			.populate({
				path: "author",
				select: "username, profilePicture",
			})
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "username, profilePicture",
				},
			})
			.sort({ "comments.createdAt": -1 })
		res.status(200).json({
			posts,
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const likePost = async (req: CustomRequest, res: Response) => {
	try {
		const UserLikePost = req.id
		const postId = req.params.id
		const post = await Post.findById(postId)
		if (!post) {
			res.status(404).json({ message: "Post not found", success: false })
			return
		}

		// like logic started
		await post.updateOne({ $addToSet: { likes: UserLikePost } })
		await post.save()

		// implement socket io for real time notification
		const user = await User.findById(UserLikePost).select(
			"username profilePicture"
		)

		const postOwnerId = post.author.toString()
		if (postOwnerId !== UserLikePost) {
			// emit a notification event
			const notification = {
				type: "like",
				userId: UserLikePost,
				userDetails: user,
				postId,
				message: "Your post was liked",
			}
			const postOwnerSocketId = getUser(postOwnerId)
			if (postOwnerSocketId) {
				getSocket()
					.to(postOwnerSocketId.socketId)
					.emit("notification", notification)
				return
			}
		}

		res.status(200).json({ message: "Post liked", success: true })
		return
	} catch (error) {}
}
export const dislikePost = async (req: CustomRequest, res: Response) => {
	try {
		const UserLikePost = req.id
		const postId = req.params.id
		const post = await Post.findById(postId)
		if (!post) {
			res.status(404).json({ message: "Post not found", success: false })
			return
		}

		// like logic started
		await post.updateOne({ $pull: { likes: UserLikePost } })
		await post.save()

		// implement socket io for real time notification
		const user = await User.findById(UserLikePost).select(
			"username profilePicture"
		)
		const postOwnerId = post.author.toString()
		if (postOwnerId !== UserLikePost) {
			// emit a notification event
			const notification = {
				type: "dislike",
				userId: UserLikePost,
				userDetails: user,
				postId,
				message: "Your post was liked",
			}
			const postOwnerSocketId = getUser(postOwnerId)
			if (postOwnerSocketId) {
				getSocket()
					.to(postOwnerSocketId.socketId)
					.emit("notification", notification)
			}
		}

		res.status(200).json({ message: "Post disliked", success: true })
		return
	} catch (error) {}
}
export const addComment = async (req: CustomRequest, res: Response) => {
	try {
		const postId = req.params.id
		const UserCommented = req.id

		console.log("postId", postId, "UserCommented", UserCommented)

		const { text } = req.body

		const post = await Post.findById(postId)

		if (!text) {
			res.status(400).json({ message: "text is required", success: false })
			return
		}

		if (!post) {
			res.status(404).json({ message: "Post not found", success: false })
			return
		}

		console.log("post", post)
		console.log("UserCommented", UserCommented)

		const comment = await Comment.create({
			text,
			author: UserCommented,
			post: postId,
		})

		await comment.populate({
			path: "author",
			select: "username profilePicture",
		})

		post.comments.push(comment._id)
		await post.save()

		res.status(201).json({
			message: "Comment Added",
			comment,
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const getCommentsOfPost = async (req: CustomRequest, res: Response) => {
	try {
		const postId = req.params.id

		const comments = await Comment.find({ post: postId }).populate(
			"author",
			"username profilePicture"
		)

		if (!comments) {
			res
				.status(404)
				.json({ message: "No comments found for this post", success: false })
			return
		}

		res.status(200).json({ success: true, comments })
		return
	} catch (error) {
		console.log(error)
	}
}
export const deletePost = async (req: CustomRequest, res: Response) => {
	try {
		const postId = req.params.id
		const authorId = req.id

		const post = await Post.findById(postId)
		if (!post) {
			res.status(404).json({ message: "Post not found", success: false })
			return
		}

		// check if the logged-in user is the owner of the post
		if (post.author.toString() !== authorId) {
			res.status(403).json({ message: "Unauthorized" })
			return
		}

		// delete post
		await Post.findByIdAndDelete(postId)

		// remove the post id from the user's post
		let user = await User.findById(authorId)

		if (!user) {
			res.status(404).json({ message: "User not found", success: false })
			return
		}

		user.posts = user.posts.filter((id) => id.toString() !== postId)
		await user.save()

		// delete associated comments
		await Comment.deleteMany({ post: postId })

		res.status(200).json({
			success: true,
			message: "Post deleted",
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const bookmarkPost = async (req: CustomRequest, res: Response) => {
	try {
		const postId = req.params.id
		const authorId = req.id
		const post = await Post.findById(postId)
		if (!post) {
			res.status(404).json({ message: "Post not found", success: false })
			return
		}
		const user = await User.findById(authorId)
		if (!user) {
			res.status(404).json({ message: "User not found", success: false })
			return
		}

		if (user.bookmarks.includes(post._id)) {
			// already bookmarked -> remove from the bookmark
			await user.updateOne({ $pull: { bookmarks: post._id } })
			await user.save()
			res.status(200).json({
				type: "unsaved",
				message: "Post removed from bookmark",
				success: true,
			})
			return
		} else {
			// bookmark krna pdega
			await user.updateOne({ $addToSet: { bookmarks: post._id } })
			await user.save()
			res
				.status(200)
				.json({ type: "saved", message: "Post bookmarked", success: true })
			return
		}
	} catch (error) {
		console.log(error)
	}
}
