import express from "express"

import { getMessage, sendMessage } from "../controllers/message.controller"
import isAuthenticated from "../middlewares/isAuthenticated"

const router = express.Router()

router.route("/send/:id").post(isAuthenticated, sendMessage)
router.route("/all/:id").get(isAuthenticated, getMessage)

export default router
