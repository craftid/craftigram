import { useEffect, type PropsWithChildren } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const ProtectedRoutes = ({ children }: PropsWithChildren) => {
	const { user } = useSelector((store: RootState) => store.auth)
	const navigate = useNavigate()
	useEffect(() => {
		if (!user) {
			navigate("/login")
		}
	}, [])
	return <>{children}</>
}

export default ProtectedRoutes
