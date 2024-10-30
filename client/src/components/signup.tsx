import {
	ChangeEventHandler,
	FormEventHandler,
	useEffect,
	useState,
} from "react"
import { RootState } from "@/redux/store"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Signup = () => {
	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
	})
	const [loading, setLoading] = useState(false)
	const { user } = useSelector((store: RootState) => store.auth)
	const navigate = useNavigate()

	const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value })
	}

	const signupHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		try {
			setLoading(true)
			const res = await axios.post("/api/v1/user/register", input, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			})
			if (res.data.success) {
				navigate("/login")
				toast.success(res.data.message)
				setInput({
					username: "",
					email: "",
					password: "",
				})
			}
		} catch (error: any) {
			console.log(error)
			toast.error(error.message ?? "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user) {
			navigate("/")
		}
	}, [])
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<form
				onSubmit={signupHandler}
				className="flex flex-col gap-5 p-8 shadow-lg"
			>
				<div className="my-4">
					<h1 className="text-center text-xl font-bold">LOGO</h1>
					<p className="text-center text-sm">
						Signup to see photos & videos from your friends
					</p>
				</div>
				<div>
					<span className="font-medium">Username</span>
					<Input
						type="text"
						name="username"
						value={input.username}
						onChange={changeEventHandler}
						className="my-2 focus-visible:ring-transparent"
					/>
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
					<Button type="submit">Signup</Button>
				)}
				<span className="text-center">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600">
						Login
					</Link>
				</span>
			</form>
		</div>
	)
}

export default Signup
