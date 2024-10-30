import { useEffect, useState } from "react"
import { setSelectedUser } from "@/redux/auth-slice"
import { setMessages } from "@/redux/chat-slice"
import { AppDispatch, RootState } from "@/redux/store"
import Messages from "@components/messages"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import axios from "axios"
import { MessageCircleCode } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

const ChatPage = () => {
	const [textMessage, setTextMessage] = useState("")
	const { user, suggestedUsers, selectedUser } = useSelector(
		(store: RootState) => store.auth
	)
	const { onlineUsers, messages } = useSelector(
		(store: RootState) => store.chat
	)
	const dispatch = useDispatch<AppDispatch>()

	const sendMessageHandler = async (receiverId: string) => {
		try {
			const res = await axios.post(
				`/api/v1/message/send/${receiverId}`,
				{ textMessage },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)
			if (res.data.success) {
				dispatch(setMessages([...messages, res.data.newMessage]))
				setTextMessage("")
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		return () => {
			dispatch(setSelectedUser(null))
		}
	}, [])

	return (
		<div className="ml-[16%] flex h-screen">
			<section className="my-8 w-full md:w-1/4">
				<h1 className="mb-4 px-3 text-xl font-bold">{user?.username}</h1>
				<hr className="mb-4 border-gray-300" />
				<div className="h-[80vh] overflow-y-auto">
					{suggestedUsers.map((suggestedUser) => {
						const isOnline = onlineUsers.includes(suggestedUser?._id)
						return (
							<div
								onClick={() => dispatch(setSelectedUser(suggestedUser))}
								className="flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50"
							>
								<Avatar className="h-14 w-14">
									<AvatarImage src={suggestedUser?.profilePicture} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium">{suggestedUser?.username}</span>
									<span
										className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"} `}
									>
										{isOnline ? "online" : "offline"}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</section>
			{selectedUser ? (
				<section className="flex h-full flex-1 flex-col border-l border-l-gray-300">
					<div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-300 bg-white px-3 py-2">
						<Avatar>
							<AvatarImage src={selectedUser?.profilePicture} alt="profile" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span>{selectedUser?.username}</span>
						</div>
					</div>
					<Messages selectedUser={selectedUser} />
					<div className="flex items-center border-t border-t-gray-300 p-4">
						<Input
							value={textMessage}
							onChange={(e) => setTextMessage(e.target.value)}
							type="text"
							className="mr-2 flex-1 focus-visible:ring-transparent"
							placeholder="Messages..."
						/>
						<Button onClick={() => sendMessageHandler(selectedUser?._id)}>
							Send
						</Button>
					</div>
				</section>
			) : (
				<div className="mx-auto flex flex-col items-center justify-center">
					<MessageCircleCode className="my-4 h-32 w-32" />
					<h1 className="font-medium">Your messages</h1>
					<span>Send a message to start a chat.</span>
				</div>
			)}
		</div>
	)
}

export default ChatPage
