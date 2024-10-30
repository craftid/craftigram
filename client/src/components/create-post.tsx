import { ChangeEventHandler, MouseEventHandler, useRef, useState } from "react"
import { setPosts } from "@/redux/post-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog"
import { Textarea } from "@components/ui/textarea"
import { DialogProps } from "@radix-ui/react-dialog"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import { readFileAsDataURL } from "@/lib/utils"

interface CreatePostProps extends DialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

const CreatePost = ({ open, setOpen }: CreatePostProps) => {
	const imageRef = useRef<HTMLInputElement>(null)
	const [file, setFile] = useState<File | string>("")
	const [caption, setCaption] = useState("")
	const [imagePreview, setImagePreview] = useState("")
	const [loading, setLoading] = useState(false)
	const { user } = useSelector((store: RootState) => store.auth)
	const { posts } = useSelector((store: RootState) => store.post)
	const dispatch = useDispatch<AppDispatch>()

	const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const file = e.target.files?.[0]
		if (file) {
			setFile(file)
			const dataUrl = await readFileAsDataURL(file)
			setImagePreview(dataUrl)
		}
	}

	const createPostHandler: MouseEventHandler<HTMLButtonElement> = async (
		_e
	) => {
		const formData = new FormData()
		formData.append("caption", caption)
		if (imagePreview) formData.append("image", file)
		try {
			setLoading(true)
			const res = await axios.post("/api/v1/post/add-post", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			})
			if (res.data.success) {
				dispatch(setPosts([res.data.post, ...posts])) // [1] -> [1,2] -> total element = 2
				toast.success(res.data.message)
				setOpen(false)
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)}>
				<DialogHeader>
					<DialogTitle className="text-center font-semibold">
						Create New Post
					</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={user?.profilePicture} alt="img" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-xs font-semibold">{user?.username}</h1>
						<span className="text-xs text-gray-600">Bio here...</span>
					</div>
				</div>
				<Textarea
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					className="border-none focus-visible:ring-transparent"
					placeholder="Write a caption..."
				/>
				{imagePreview && (
					<div className="flex h-64 w-full items-center justify-center">
						<img
							src={imagePreview}
							alt="preview_img"
							className="h-full w-full rounded-md object-cover"
						/>
					</div>
				)}
				<input
					ref={imageRef}
					type="file"
					className="hidden"
					accept="image/*"
					onChange={fileChangeHandler}
				/>
				<Button
					onClick={() => imageRef.current && imageRef.current.click()}
					className="mx-auto w-fit bg-[#0095F6] hover:bg-[#258bcf]"
				>
					Select from computer
				</Button>
				{imagePreview &&
					(loading ? (
						<Button>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Please wait
						</Button>
					) : (
						<Button
							onClick={createPostHandler}
							type="submit"
							className="w-full"
						>
							Post
						</Button>
					))}
			</DialogContent>
		</Dialog>
	)
}

export default CreatePost
