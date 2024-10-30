import { useState } from "react"
import { setAuthUser } from "@/redux/auth-slice"
import { setPosts, setSelectedPost } from "@/redux/post-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import axios from "axios"
import {
	Heart,
	Home,
	LogOut,
	MessageCircle,
	PlusSquare,
	Search,
	TrendingUp,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import CreatePost from "./create-post"

const LeftSidebar = () => {
	const navigate = useNavigate()
	const { user } = useSelector((store: RootState) => store.auth)
	const { likeNotification } = useSelector(
		(store: RootState) => store.realTimeNotification
	)
	const dispatch = useDispatch<AppDispatch>()
	const [open, setOpen] = useState(false)

	const logoutHandler = async () => {
		try {
			const res = await axios.get("/api/v1/user/logout", {
				withCredentials: true,
			})
			if (res.data.success) {
				dispatch(setAuthUser(null))
				dispatch(setSelectedPost(null))
				dispatch(setPosts([]))
				navigate("/login")
				toast.success(res.data.message)
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.message)
		}
	}

	const sidebarHandler = (textType: string) => {
		if (textType === "Logout") {
			logoutHandler()
		} else if (textType === "Create") {
			setOpen(true)
		} else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`)
		} else if (textType === "Home") {
			navigate("/")
		} else if (textType === "Messages") {
			navigate("/chat")
		}
	}

	const sidebarItems = [
		{ icon: <Home />, text: "Home" },
		{ icon: <Search />, text: "Search" },
		{ icon: <TrendingUp />, text: "Explore" },
		{ icon: <MessageCircle />, text: "Messages" },
		{ icon: <Heart />, text: "Notifications" },
		{ icon: <PlusSquare />, text: "Create" },
		{
			icon: (
				<Avatar className="h-6 w-6">
					<AvatarImage src={user?.profilePicture} alt="@shadcn" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			),
			text: "Profile",
		},
		{ icon: <LogOut />, text: "Logout" },
	]
	return (
		<div className="fixed left-0 top-0 z-10 h-screen w-[16%] border-r border-gray-300 px-4">
			<div className="flex flex-col">
				<h1 className="my-8 pl-3 text-xl font-bold">LOGO</h1>
				<div>
					{sidebarItems.map((item, index) => {
						return (
							<div
								onClick={() => sidebarHandler(item.text)}
								key={index}
								className="relative my-3 flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
							>
								{item.icon}
								<span>{item.text}</span>
								{item.text === "Notifications" &&
									likeNotification.length > 0 && (
										<Popover>
											<PopoverTrigger asChild>
												<Button
													size="icon"
													className="absolute bottom-6 left-6 h-5 w-5 rounded-full bg-red-600 hover:bg-red-600"
												>
													{likeNotification.length}
												</Button>
											</PopoverTrigger>
											<PopoverContent>
												<div>
													{likeNotification.length === 0 ? (
														<p>No new notification</p>
													) : (
														likeNotification.map((notification) => {
															return (
																<div
																	key={notification.userId}
																	className="my-2 flex items-center gap-2"
																>
																	<Avatar>
																		<AvatarImage
																			src={
																				notification.userDetails?.profilePicture
																			}
																		/>
																		<AvatarFallback>CN</AvatarFallback>
																	</Avatar>
																	<p className="text-sm">
																		<span className="font-bold">
																			{notification.userDetails?.username}
																		</span>{" "}
																		liked your post
																	</p>
																</div>
															)
														})
													)}
												</div>
											</PopoverContent>
										</Popover>
									)}
							</div>
						)
					})}
				</div>
			</div>

			<CreatePost open={open} setOpen={setOpen} />
		</div>
	)
}

export default LeftSidebar
