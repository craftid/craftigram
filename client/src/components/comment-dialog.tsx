import { ChangeEventHandler, useEffect, useState } from "react"
import { Comment as PostComment, setPosts } from "@/redux/post-slice"
import { AppDispatch, RootState } from "@/redux/store"
import Comment from "@components/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog"
import axios from "axios"
import { MoreHorizontal } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "sonner"

interface CommentDialogProps extends React.HTMLAttributes<HTMLDivElement> {
	open: boolean
	setOpen: (open: boolean) => void
}

const CommentDialog = ({ open, setOpen }: CommentDialogProps) => {
	const [text, setText] = useState("")
	const { selectedPost, posts } = useSelector((store: RootState) => store.post)
	const [comment, setComment] = useState<PostComment[]>([])
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		if (selectedPost) {
			setComment(selectedPost.comments)
		}
	}, [selectedPost])

	const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		const inputText = e.target.value
		if (inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}

	const sendMessageHandler = async () => {
		try {
			const res = await axios.post(
				`/api/v1/post/${selectedPost?._id}/comment`,
				{ text },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)

			if (res.data.success) {
				const updatedCommentData = [...comment, res.data.comment]
				setComment(updatedCommentData)

				const updatedPostData = posts.map((p) =>
					selectedPost && p._id === selectedPost._id
						? { ...p, comments: updatedCommentData }
						: p
				)
				dispatch(setPosts(updatedPostData))
				toast.success(res.data.message)
				setText("")
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	return (
		<Dialog open={open}>
			<DialogContent
				onInteractOutside={() => setOpen(false)}
				className="flex max-w-5xl flex-col p-0"
			>
				<div className="flex flex-1">
					<div className="w-1/2">
						<img
							src={selectedPost?.image}
							alt="post_img"
							className="h-full w-full rounded-l-lg object-cover"
						/>
					</div>
					<div className="flex w-1/2 flex-col justify-between">
						<div className="flex items-center justify-between p-4">
							<div className="flex items-center gap-3">
								<Link to={`${selectedPost?.author}`}>
									<Avatar>
										<AvatarImage src={selectedPost?.author?.profilePicture} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div>
									<Link
										to={`${selectedPost?.author}`}
										className="text-xs font-semibold"
									>
										{selectedPost?.author?.username}
									</Link>
									{/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
								</div>
							</div>

							<Dialog>
								<DialogTrigger asChild>
									<MoreHorizontal className="cursor-pointer" />
								</DialogTrigger>
								<DialogContent className="flex flex-col items-center text-center text-sm">
									<div className="w-full cursor-pointer font-bold text-[#ED4956]">
										Unfollow
									</div>
									<div className="w-full cursor-pointer">Add to favorites</div>
								</DialogContent>
							</Dialog>
						</div>
						<hr />
						<div className="max-h-96 flex-1 overflow-y-auto p-4">
							{comment.map((comment) => (
								<Comment key={comment._id} comment={comment} />
							))}
						</div>
						<div className="p-4">
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={text}
									onChange={changeEventHandler}
									placeholder="Add a comment..."
									className="w-full rounded border border-gray-300 p-2 text-sm outline-none"
								/>
								<Button
									disabled={!text.trim()}
									onClick={sendMessageHandler}
									variant="outline"
								>
									Send
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CommentDialog
