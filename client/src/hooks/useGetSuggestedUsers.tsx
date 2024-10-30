import { useEffect } from "react"
import { setSuggestedUsers } from "@/redux/auth-slice"
import { AppDispatch } from "@/redux/store"
import axios from "axios"
import { useDispatch } from "react-redux"

const useGetSuggestedUsers = () => {
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			try {
				const res = await axios.get("/api/v1/user/suggested", {
					withCredentials: true,
				})
				if (res.data.success) {
					dispatch(setSuggestedUsers(res.data.users))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchSuggestedUsers()
	}, [])
}
export default useGetSuggestedUsers
