import { useEffect } from "react"
import { setMessages } from "@/redux/chat-slice"
import { AppDispatch, RootState } from "@/redux/store"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessage = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { selectedUser } = useSelector((store: RootState) => store.auth)
	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				const res = await axios.get(
					`/api/v1/message/all/${selectedUser?._id}`,
					{ withCredentials: true }
				)
				if (res.data.success) {
					dispatch(setMessages(res.data.messages))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllMessage()
	}, [selectedUser])
}
export default useGetAllMessage
