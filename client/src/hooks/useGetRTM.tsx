import { useEffect } from "react"
import { setMessages } from "@/redux/chat-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

const useGetRTM = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { socket } = useSelector((store: RootState) => store.socketio)
	const { messages } = useSelector((store: RootState) => store.chat)
	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			dispatch(setMessages([...messages, newMessage]))
		})

		return () => {
			socket?.off("newMessage")
		}
	}, [messages, setMessages])
}
export default useGetRTM
