import axios from "axios"
import { Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@/components/ui/button"

import { setPosts, type Comment } from "@/redux/post-slice"
import { AppDispatch, RootState } from "@/redux/store"

const Comment = ({ comment, postId }: { comment: Comment; postId: string }) => {
	const { posts } = useSelector((store: RootState) => store.post)
	const dispatch = useDispatch<AppDispatch>()

	const deleteCommentHandler = async (commentId: string, postId: string) => {
		try {
			const res = await axios.delete(
				`/api/v1/post/${postId}/comment/${commentId}`,
				{
					withCredentials: true,
				}
			)

			if (res.data.success) {
				toast.success(res.data.message)
				const updatedComments = posts.map((p) =>
					p._id === postId
						? {
								...p,
								comments: p.comments.filter((c) => c._id !== commentId),
							}
						: p
				)
				dispatch(setPosts(updatedComments))
			}
		} catch (error) {
			console.log(error)
		}
	}

	if (!comment) return null

	return (
		<div className="my-2">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarImage
						src={comment?.author?.profilePicture}
						alt={`@${comment.author.username}`}
					/>
					<AvatarFallback>
						{comment?.author.username[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<h3 className="text-sm font-bold">{comment?.author.username} </h3>
				<span className="pl-1 font-normal">{comment?.text}</span>
				<Button
					className="ml-auto h-8 w-8 [&_svg]:size-3"
					variant="destructive"
					size="icon"
					onClick={() => deleteCommentHandler(comment._id, postId)}
				>
					<Trash2 size={8} />
				</Button>
			</div>
		</div>
	)
}

export default Comment
