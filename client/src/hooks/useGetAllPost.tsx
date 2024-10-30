import { useEffect } from "react"
import { setPosts } from "@/redux/post-slice"
import { AppDispatch } from "@/redux/store"
import axios from "axios"
import { useDispatch } from "react-redux"

const useGetAllPost = () => {
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		const fetchAllPost = async () => {
			try {
				const res = await axios.get("/api/v1/post/all", {
					withCredentials: true,
				})
				if (res.data.success) {
					dispatch(setPosts(res.data.posts))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllPost()
	}, [])
}
export default useGetAllPost
