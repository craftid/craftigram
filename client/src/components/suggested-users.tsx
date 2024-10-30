import { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const SuggestedUsers = () => {
	const { suggestedUsers } = useSelector((store: RootState) => store.auth)
	return (
		<div className="my-10">
			<div className="flex items-center justify-between text-sm">
				<h1 className="font-semibold text-gray-600">Suggested for you</h1>
				<span className="cursor-pointer font-medium">See All</span>
			</div>
			{suggestedUsers.map((user) => {
				return (
					<div
						key={user._id}
						className="my-5 flex items-center justify-between"
					>
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
						<span className="cursor-pointer text-xs font-bold text-[#3BADF8] hover:text-[#3495d6]">
							Follow
						</span>
					</div>
				)
			})}
		</div>
	)
}

export default SuggestedUsers
