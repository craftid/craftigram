import { Router } from "express"

import apiRoutes from "./api.route"
import messageRoutes from "./message.route"
import postRoutes from "./post.route"
import userRoutes from "./user.route"

const router = Router()

router.use("/api", apiRoutes)
router.use("/user", userRoutes)
router.use("/post", postRoutes)
router.use("/message", messageRoutes)

router.get("/", async (req, res) => {
	// Handle /api requests
	res.json({ message: "Hello from API" })
})

export default router
