import { Outlet } from "react-router-dom"

import useGetAllPost from "@/hooks/useGetAllPost"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"

import Feed from "./feed"
import RightSidebar from "./right-sidebar"

const Home = () => {
	useGetAllPost()
	useGetSuggestedUsers()
	return (
		<div className="flex">
			<div className="flex-grow">
				<Feed />
				<Outlet />
			</div>
			<RightSidebar />
		</div>
	)
}

export default Home
