import {
	ChangeEventHandler,
	FormEventHandler,
	useEffect,
	useState,
} from "react"
import { setAuthUser } from "@/redux/auth-slice"
import { AppDispatch, RootState } from "@/redux/store"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {
	const [input, setInput] = useState({
		email: "",
		password: "",
	})
	const [loading, setLoading] = useState(false)
	const { user } = useSelector((store: RootState) => store.auth)
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value })
	}

	const signupHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		try {
			setLoading(true)
			const res = await axios.post("/api/v1/user/login", input, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			})
			if (res.data.success) {
				dispatch(setAuthUser(res.data.userResponse))
				navigate("/")
				toast.success(res.data.message)
				setInput({
					email: "",
					password: "",
				})
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		console.log("user", user)
		if (user) {
			navigate("/")
		}
	}, [user])
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<form
				onSubmit={signupHandler}
				className="flex flex-col gap-5 p-8 shadow-lg"
			>
				<div className="my-4">
					<h1 className="text-center text-xl font-bold">LOGO</h1>
					<p className="text-center text-sm">
						Login to see photos & videos from your friends
					</p>
				</div>
				<div>
					<span className="font-medium">Email</span>
					<Input
						type="email"
						name="email"
						value={input.email}
						onChange={changeEventHandler}
						className="my-2 focus-visible:ring-transparent"
					/>
				</div>
				<div>
					<span className="font-medium">Password</span>
					<Input
						type="password"
						name="password"
						value={input.password}
						onChange={changeEventHandler}
						className="my-2 focus-visible:ring-transparent"
					/>
				</div>
				{loading ? (
					<Button>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				) : (
					<Button type="submit">Login</Button>
				)}

				<span className="text-center">
					Dosent have an account?{" "}
					<Link to="/signup" className="text-blue-600">
						Signup
					</Link>
				</span>
			</form>
		</div>
	)
}

export default Login
