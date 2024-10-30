import { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import SuggestedUsers from "@/components/suggested-users"

const RightSidebar = () => {
	const { user } = useSelector((store: RootState) => store.auth)
	return (
		<div className="my-10 w-fit pr-32">
			<div className="flex items-center gap-2">
				<Link to={`/profile/${user?._id}`}>
					<Avatar>
						<AvatarImage src={user?.profilePicture} alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<h1 className="text-sm font-semibold">
						<Link to={`/profile/${user?._id}`}>{user?.username}</Link>
					</h1>
					<span className="text-sm text-gray-600">
						{user?.bio || "Bio here..."}
					</span>
				</div>
			</div>
			<SuggestedUsers />
		</div>
	)
}

export default RightSidebar
