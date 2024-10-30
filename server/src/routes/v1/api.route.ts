import { Router } from "express"

const router = Router()

router.get("/", async (_req, res) => {
	// Handle /api requests
	res.json({ message: "Hello from API" })
})

export default router
