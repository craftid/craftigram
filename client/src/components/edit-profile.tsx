import { ChangeEventHandler, useRef, useState } from "react"
import { setAuthUser } from "@/redux/auth-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@components/ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select"
import { Textarea } from "@components/ui/textarea"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const EditProfile = () => {
	const imageRef = useRef<HTMLInputElement>(null)
	const { user } = useSelector((store: RootState) => store.auth)
	const [loading, setLoading] = useState(false)
	const [input, setInput] = useState<{
		profilePhoto: string | File | undefined
		bio: string | undefined
		gender: string | undefined
	}>({
		profilePhoto: user?.profilePicture,
		bio: user?.bio,
		gender: user?.gender,
	})
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files?.[0]
		if (file) setInput({ ...input, profilePhoto: file })
	}

	const selectChangeHandler = (value: string) => {
		setInput({ ...input, gender: value })
	}

	const editProfileHandler = async () => {
		const formData = new FormData()
		if (input.bio) {
			formData.append("bio", input.bio)
		}
		if (input.gender) {
			formData.append("gender", input.gender)
		}
		if (input.profilePhoto) {
			formData.append("profilePhoto", input.profilePhoto)
		}
		try {
			setLoading(true)
			const res = await axios.post("/api/v1/user/profile/edit", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			})
			if (res.data.success) {
				const updatedUserData = {
					...user,
					bio: res.data.user?.bio,
					profilePicture: res.data.user?.profilePicture,
					gender: res.data.user.gender,
				}
				dispatch(setAuthUser(updatedUserData))
				navigate(`/profile/${user?._id}`)
				toast.success(res.data.message)
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.message)
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="mx-auto flex max-w-2xl pl-10">
			<section className="my-8 flex w-full flex-col gap-6">
				<h1 className="text-xl font-bold">Edit Profile</h1>
				<div className="flex items-center justify-between rounded-xl bg-gray-100 p-4">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={user?.profilePicture} alt="post_image" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-sm font-bold">{user?.username}</h1>
							<span className="text-gray-600">
								{user?.bio || "Bio here..."}
							</span>
						</div>
					</div>
					<input
						ref={imageRef}
						onChange={fileChangeHandler}
						type="file"
						className="hidden"
					/>
					<Button
						onClick={() => imageRef.current && imageRef.current.click()}
						className="h-8 bg-[#0095F6] hover:bg-[#318bc7]"
					>
						Change photo
					</Button>
				</div>
				<div>
					<h1 className="mb-2 text-xl font-bold">Bio</h1>
					<Textarea
						value={input.bio}
						onChange={(e) => setInput({ ...input, bio: e.target.value })}
						name="bio"
						className="focus-visible:ring-transparent"
					/>
				</div>
				<div>
					<h1 className="mb-2 font-bold">Gender</h1>
					<Select
						defaultValue={input.gender}
						onValueChange={selectChangeHandler}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="male">Male</SelectItem>
								<SelectItem value="female">Female</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex justify-end">
					{loading ? (
						<Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Please wait
						</Button>
					) : (
						<Button
							onClick={editProfileHandler}
							className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
						>
							Submit
						</Button>
					)}
				</div>
			</section>
		</div>
	)
}

export default EditProfile
