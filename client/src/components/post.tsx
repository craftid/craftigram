import { ChangeEventHandler, useState } from "react"
import { setPosts, setSelectedPost, type Post } from "@/redux/post-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog"
import axios from "axios"
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import CommentDialog from "./comment-dialog"

const Post = ({ post }: { post: Post }) => {
	const [text, setText] = useState("")
	const [open, setOpen] = useState(false)
	const { user } = useSelector((store: RootState) => store.auth)
	const { posts } = useSelector((store: RootState) => store.post)
	const [liked, setLiked] = useState(
		user ? post.likes.includes(user?._id) : false
	)
	const [postLike, setPostLike] = useState(post.likes.length)
	const [comment, setComment] = useState(post.comments)
	const dispatch = useDispatch<AppDispatch>()

	const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		const inputText = e.target.value
		if (inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}

	const likeOrDislikeHandler = async () => {
		try {
			const action = liked ? "dislike" : "like"
			const res = await axios.get(`/api/v1/post/${post._id}/${action}`, {
				withCredentials: true,
			})
			console.log(res.data)
			if (res.data.success) {
				const updatedLikes = liked ? postLike - 1 : postLike + 1
				setPostLike(updatedLikes)
				setLiked(!liked)

				// apne post ko update krunga
				const updatedPostData = posts.map((p) =>
					user && p._id === post._id
						? {
								...p,
								likes: liked
									? p.likes.filter((id) => id !== user._id)
									: [...p.likes, user._id],
							}
						: p
				)
				dispatch(setPosts(updatedPostData))
				toast.success(res.data.message)
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const commentHandler = async () => {
		try {
			const res = await axios.post(
				`/api/v1/post/${post._id}/comment`,
				{ text },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)
			console.log(res.data)
			if (res.data.success) {
				const updatedCommentData = [...comment, res.data.comment]
				setComment(updatedCommentData)

				const updatedPostData = posts.map((p) =>
					p._id === post._id ? { ...p, comments: updatedCommentData } : p
				)

				dispatch(setPosts(updatedPostData))
				toast.success(res.data.message)
				setText("")
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const deletePostHandler = async () => {
		try {
			const res = await axios.delete(`/api/v1/post/delete/${post?._id}`, {
				withCredentials: true,
			})
			if (res.data.success) {
				const updatedPostData = posts.filter(
					(postItem) => postItem?._id !== post?._id
				)
				dispatch(setPosts(updatedPostData))
				toast.success(res.data.message)
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.response.data.messsage)
		}
	}

	const bookmarkHandler = async () => {
		try {
			const res = await axios.get(`/api/v1/post/${post?._id}/bookmark`, {
				withCredentials: true,
			})
			if (res.data.success) {
				toast.success(res.data.message)
			}
		} catch (error: any) {
			console.log(error)
		}
	}
	return (
		<div className="mx-auto my-8 w-full max-w-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={post.author?.profilePicture} alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="flex items-center gap-3">
						<h1>{post.author?.username}</h1>
						{user?._id === post.author._id && (
							<Badge variant="secondary">Author</Badge>
						)}
					</div>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>
					<DialogContent className="flex flex-col items-center text-center text-sm">
						{post?.author?._id !== user?._id && (
							<Button
								variant="ghost"
								className="w-fit cursor-pointer font-bold text-[#ED4956]"
							>
								Unfollow
							</Button>
						)}

						<Button variant="ghost" className="w-fit cursor-pointer">
							Add to favorites
						</Button>
						{user && user?._id === post?.author._id && (
							<Button
								onClick={deletePostHandler}
								variant="ghost"
								className="w-fit cursor-pointer"
							>
								Delete
							</Button>
						)}
					</DialogContent>
				</Dialog>
			</div>
			<img
				className="my-2 aspect-square w-full rounded-sm object-cover"
				src={post.image}
				alt="post_img"
			/>

			<div className="my-2 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{liked ? (
						<FaHeart
							onClick={likeOrDislikeHandler}
							size={"24"}
							className="cursor-pointer text-red-600"
						/>
					) : (
						<FaRegHeart
							onClick={likeOrDislikeHandler}
							size={"22px"}
							className="cursor-pointer hover:text-gray-600"
						/>
					)}

					<MessageCircle
						onClick={() => {
							dispatch(setSelectedPost(post))
							setOpen(true)
						}}
						className="cursor-pointer hover:text-gray-600"
					/>
					<Send className="cursor-pointer hover:text-gray-600" />
				</div>
				<Bookmark
					onClick={bookmarkHandler}
					className="cursor-pointer hover:text-gray-600"
				/>
			</div>
			<span className="mb-2 block font-medium">{postLike} likes</span>
			<p>
				<span className="mr-2 font-medium">{post.author?.username}</span>
				{post.caption}
			</p>
			{comment.length > 0 && (
				<span
					onClick={() => {
						dispatch(setSelectedPost(post))
						setOpen(true)
					}}
					className="cursor-pointer text-sm text-gray-400"
				>
					View all {comment.length} comments
				</span>
			)}
			<CommentDialog open={open} setOpen={setOpen} />
			<div className="flex items-center justify-between">
				<input
					type="text"
					placeholder="Add a comment..."
					value={text}
					onChange={changeEventHandler}
					className="w-full text-sm outline-none"
				/>
				{text && (
					<span
						onClick={commentHandler}
						className="cursor-pointer text-[#3BADF8]"
					>
						Post
					</span>
				)}
			</div>
		</div>
	)
}

export default Post
