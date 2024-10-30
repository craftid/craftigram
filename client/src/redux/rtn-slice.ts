import { createSlice } from "@reduxjs/toolkit"

interface Notification {
	type: string
	userId: string
	userDetails?: {
		username: string
		profilePicture: string
	}
}

const initialState = {
	likeNotification: [] as Notification[],
}

const rtnSlice = createSlice({
	name: "realTimeNotification",
	initialState,
	reducers: {
		setLikeNotification: (state, action: { payload: Notification }) => {
			if (action.payload.type === "like") {
				state.likeNotification.push(action.payload)
			} else if (action.payload.type === "dislike") {
				state.likeNotification = state.likeNotification.filter(
					(item) => item.userId !== action.payload.userId
				)
			}
		},
	},
})
export const { setLikeNotification } = rtnSlice.actions
export default rtnSlice.reducer
