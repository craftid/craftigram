import { Post } from "@/redux/post-slice"
import { createSlice } from "@reduxjs/toolkit"

export interface User {
	_id: string
	username: string
	email: string
	password: string
	profilePicture?: string
	bio?: string
	gender?: "male" | "female"
	followers: string[]
	following: string[]
	posts: Post[]
	bookmarks: Post[]
}

const initialState = {
	user: null as User | null,
	suggestedUsers: [] as User[],
	userProfile: null as User | null,
	selectedUser: null as User | null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthUser: (state, action) => {
			state.user = action.payload
		},
		setSuggestedUsers: (state, action) => {
			state.suggestedUsers = action.payload
		},
		setUserProfile: (state, action) => {
			state.userProfile = action.payload
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload
		},
	},
})
export const {
	setAuthUser,
	setSuggestedUsers,
	setUserProfile,
	setSelectedUser,
} = authSlice.actions
export default authSlice.reducer
