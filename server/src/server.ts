import { createServer } from "node:http"
import express, { json, urlencoded, type Request } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import debug from "debug"
import helmet from "helmet"
import type { JwtPayload } from "jsonwebtoken"
import morgan from "morgan"

import connectDB from "./db"
import logParamsAndQueries from "./middlewares/logParamsAndQueries"
import routes from "./routes"
import { setupSocket } from "./socket"

export interface CustomRequest extends Request {
	id?: string | JwtPayload
}

export const server = () => {
	debug.enable("express")
	const log = debug("express")
	const app = express()
	const server = createServer(app)

	connectDB()

	log("Loading middleware...")
	app.use(express.json())
	app.use(helmet())
	app.use(cors())

	if (process.env.NODE_ENV === "development") {
		app.use(cors({ origin: "http://localhost:5173" }))
	}

	app.use(urlencoded({ extended: true }))
	app.use(json())
	app.use(express.json())
	app.use(cookieParser())
	app.use(morgan("dev"))

	app.use(logParamsAndQueries)

	log("Middleware loaded successfully")

	log("Loading routes...")
	app.use(routes)
	log("Routes loaded successfully")

	log("Setting up socket...")
	setupSocket(server)
	log("Socket setup successfully")

	return server
}
