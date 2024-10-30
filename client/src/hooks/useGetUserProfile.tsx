import { useEffect } from "react"
import { setUserProfile } from "@/redux/auth-slice"
import { AppDispatch } from "@/redux/store"
import axios from "axios"
import { useDispatch } from "react-redux"

const useGetUserProfile = (userId: string) => {
	const dispatch = useDispatch<AppDispatch>()
	// const [userProfile, setUserProfile] = useState(null);
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await axios.get(`/api/v1/user/${userId}/profile`, {
					withCredentials: true,
				})
				if (res.data.success) {
					dispatch(setUserProfile(res.data.user))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchUserProfile()
	}, [userId])
}
export default useGetUserProfile
