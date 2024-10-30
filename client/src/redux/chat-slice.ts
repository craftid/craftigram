import { createSlice } from "@reduxjs/toolkit"

import { Message } from "./message-slice"

export interface ChatState {
	onlineUsers: string[]
	messages: Message[]
}

const initialState: ChatState = {
	onlineUsers: [],
	messages: [],
}

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		// actions
		setOnlineUsers: (state, action) => {
			state.onlineUsers = action.payload
		},
		setMessages: (state, action) => {
			state.messages = action.payload
		},
	},
})
export const { setOnlineUsers, setMessages } = chatSlice.actions
export default chatSlice.reducer
