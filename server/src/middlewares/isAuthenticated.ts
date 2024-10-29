import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"

import env from "../env"
import type { CustomRequest } from "../server"

const isAuthenticated = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies.token
		if (!token) {
			res.status(401).json({
				message: "User not authenticated",
				success: false,
			})
			return
		}
		const decode = await jwt.verify(token, env.JWT_SECRET)
		if (typeof decode !== "string" && "userId" in decode) {
			req.id = decode.userId
		} else {
			res.status(401).json({
				message: "Invalid token",
				success: false,
			})
			return
		}
		next()
	} catch (error) {
		console.log(error)
		res.status(401).json({
			message: "User not authenticated",
			success: false,
		})
		return
	}
}
export default isAuthenticated
