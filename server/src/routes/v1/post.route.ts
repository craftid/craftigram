import express from "express"

import {
	addComment,
	addNewPost,
	bookmarkPost,
	deleteComment,
	deletePost,
	dislikePost,
	getAllPost,
	getCommentsOfPost,
	getUserPost,
	likePost,
} from "../../controllers/post.controller"
import isAuthenticated from "../../middlewares/isAuthenticated"
import upload from "../../middlewares/multer"

const router = express.Router()

router
	.route("/add-post")
	.post(isAuthenticated, upload.single("image"), addNewPost)
router.route("/all").get(isAuthenticated, getAllPost)
router.route("/user-post/all").get(isAuthenticated, getUserPost)
router.route("/:id/like").get(isAuthenticated, likePost)
router.route("/:id/dislike").get(isAuthenticated, dislikePost)
router.route("/:id/comment").post(isAuthenticated, addComment)
router.route("/:id/comment/:id").delete(isAuthenticated, deleteComment)
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost)
router.route("/delete/:id").delete(isAuthenticated, deletePost)
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost)

export default router
