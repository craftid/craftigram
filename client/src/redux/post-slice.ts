import { User } from "@/redux/auth-slice"
import { createSlice } from "@reduxjs/toolkit"

export interface Comment {
	_id: string
	text: string
	author: User
}

export interface Post {
	_id: string
	caption?: string
	image: string
	author: User
	likes: string[]
	comments: Comment[]
}

const initialState = {
	posts: [] as Post[],
	selectedPost: null as Post | null,
}

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		//actions
		setPosts: (state, action) => {
			state.posts = action.payload
		},
		setSelectedPost: (state, action) => {
			state.selectedPost = action.payload
		},
	},
})
export const { setPosts, setSelectedPost } = postSlice.actions
export default postSlice.reducer
