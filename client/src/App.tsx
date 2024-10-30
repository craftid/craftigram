import { useEffect } from "react"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { io } from "socket.io-client"

import ChatPage from "@/components/chat-page"
import EditProfile from "@/components/edit-profile"
import Home from "@/components/home"
import Login from "@/components/login"
import MainLayout from "@/components/main-layout"
import Profile from "@/components/profile"
import ProtectedRoutes from "@/components/protected-routes"
import Signup from "@/components/signup"

import { setOnlineUsers } from "./redux/chat-slice"
import { setLikeNotification } from "./redux/rtn-slice"
import { setSocket } from "./redux/socket-slice"

const browserRouter = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoutes>
				<MainLayout />
			</ProtectedRoutes>
		),
		children: [
			{
				path: "/",
				element: (
					<ProtectedRoutes>
						<Home />
					</ProtectedRoutes>
				),
			},
			{
				path: "/profile/:id",
				element: (
					<ProtectedRoutes>
						{" "}
						<Profile />
					</ProtectedRoutes>
				),
			},
			{
				path: "/account/edit",
				element: (
					<ProtectedRoutes>
						<EditProfile />
					</ProtectedRoutes>
				),
			},
			{
				path: "/chat",
				element: (
					<ProtectedRoutes>
						<ChatPage />
					</ProtectedRoutes>
				),
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
])

function App() {
	return <RouterProvider router={browserRouter} />
}

export default App
