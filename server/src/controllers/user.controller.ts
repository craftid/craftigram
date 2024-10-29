import { Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

import env from "../env"
import { Post } from "../model/post.model"
import { User } from "../model/user.model"
import type { CustomRequest } from "../server"
import cloudinary from "../utils/cloudinary"
import getDataUri from "../utils/datauri"

export const register = async (req: CustomRequest, res: Response) => {
	try {
		const { username, email, password } = req.body
		if (!username || !email || !password) {
			res.status(401).json({
				message: "Something is missing, please check!",
				success: false,
			})
			return
		}
		const user = await User.findOne({ email })
		if (user) {
			res.status(401).json({
				message: "Try different email",
				success: false,
			})
			return
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		await User.create({
			username,
			email,
			password: hashedPassword,
		})
		res.status(201).json({
			message: "Account created successfully.",
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const login = async (req: CustomRequest, res: Response) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			res.status(401).json({
				message: "Something is missing, please check!",
				success: false,
			})
			return
		}
		let user = await User.findOne({ email })
		if (!user) {
			res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			})
			return
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password)
		if (!isPasswordMatch) {
			res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			})
			return
		}

		const token = await jwt.sign({ userId: user._id }, env.JWT_SECRET, {
			expiresIn: "1d",
		})

		// populate each post if in the posts array
		const populatedPosts = await Promise.all(
			user.posts.slice(0, 20).map(async (postId) => {
				const post = await Post.findById(postId)

				if (post && user && post.author.equals(user._id)) {
					return post
				}
				return null
			})
		)

		const userResponse = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts,
		}
		res
			.cookie("token", token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1 * 24 * 60 * 60 * 1000,
			})
			.json({
				message: `Welcome back ${user.username}`,
				success: true,
				userResponse,
			})
		return
	} catch (error) {
		console.log(error)
	}
}
export const logout = async (_: CustomRequest, res: Response) => {
	try {
		res.cookie("token", "", { maxAge: 0 }).json({
			message: "Logged out successfully.",
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const getProfile = async (req: CustomRequest, res: Response) => {
	try {
		const userId = req.params.id
		let user = await User.findById(userId)
			.populate({ path: "posts" })
			.sort({ createdAt: -1 })
			.populate("bookmarks")
		res.status(200).json({
			user,
			success: true,
		})
		return
	} catch (error) {
		console.log(error)
	}
}

export const editProfile = async (req: CustomRequest, res: Response) => {
	try {
		const userId = req.id
		const { bio, gender } = req.body
		const profilePicture = req.file
		let cloudResponse

		if (profilePicture) {
			const fileUri = getDataUri(profilePicture)
			if (!fileUri) {
				res.status(500).json({
					message: "Error uploading image",
					success: false,
				})
				return
			}
			cloudResponse = await cloudinary.uploader.upload(fileUri)
		}

		const user = await User.findById(userId).select("-password")
		if (!user) {
			res.status(404).json({
				message: "User not found.",
				success: false,
			})
			return
		}
		if (bio) user.bio = bio
		if (gender) user.gender = gender

		if (profilePicture && cloudResponse)
			user.profilePicture = cloudResponse.secure_url

		await user.save()

		res.status(200).json({
			message: "Profile updated.",
			success: true,
			user,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const getSuggestedUsers = async (req: CustomRequest, res: Response) => {
	try {
		const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
			"-password"
		)
		if (!suggestedUsers) {
			res.status(400).json({
				message: "Currently do not have any users",
			})
			return
		}
		res.status(200).json({
			success: true,
			users: suggestedUsers,
		})
		return
	} catch (error) {
		console.log(error)
	}
}
export const followOrUnfollow = async (req: CustomRequest, res: Response) => {
	try {
		const followKrneWala = req.id // patel
		const jiskoFollowKrunga = req.params.id // shivani
		if (followKrneWala === jiskoFollowKrunga) {
			res.status(400).json({
				message: "You cannot follow/unfollow yourself",
				success: false,
			})
			return
		}

		const user = await User.findById(followKrneWala)
		const targetUser = await User.findById(jiskoFollowKrunga)

		if (!user || !targetUser) {
			res.status(400).json({
				message: "User not found",
				success: false,
			})
			return
		}
		// mai check krunga ki follow krna hai ya unfollow
		const isFollowing = user.following.includes(
			new Types.ObjectId(jiskoFollowKrunga)
		)
		if (isFollowing) {
			// unfollow logic ayega
			await Promise.all([
				User.updateOne(
					{ _id: followKrneWala },
					{ $pull: { following: jiskoFollowKrunga } }
				),
				User.updateOne(
					{ _id: jiskoFollowKrunga },
					{ $pull: { followers: followKrneWala } }
				),
			])
			res
				.status(200)
				.json({ message: "Unfollowed successfully", success: true })
			return
		} else {
			// follow logic ayega
			await Promise.all([
				User.updateOne(
					{ _id: followKrneWala },
					{ $push: { following: jiskoFollowKrunga } }
				),
				User.updateOne(
					{ _id: jiskoFollowKrunga },
					{ $push: { followers: followKrneWala } }
				),
			])
			res.status(200).json({ message: "followed successfully", success: true })
			return
		}
	} catch (error) {
		console.log(error)
	}
}
