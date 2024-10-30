import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import Post from "./post"

const Posts = () => {
	const { posts } = useSelector((store: RootState) => store.post)
	return (
		<div>
			{posts.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	)
}

export default Posts
