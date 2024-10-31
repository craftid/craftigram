import { useEffect } from "react"
import { setMessages } from "@/redux/chat-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

const useGetRTM = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { messages } = useSelector((store: RootState) => store.chat)
	useEffect(() => {}, [messages, dispatch])
}
export default useGetRTM
