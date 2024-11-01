import type { Comment } from "@/redux/post-slice"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const Comment = ({ comment, postId }: { comment: Comment; postId: string }) => {
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
				<Button onClick={() => deleteCommentHandler(comment._id, postId)}>
					Delete
				</Button>
			</div>
		</div>
	)
}

export default Comment
