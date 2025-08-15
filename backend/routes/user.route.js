
import express from "express"
import {userSignUp, userLogin, userLogout,userUpdate, getAllUsers, getUser} from "../controllers/user.controller.js"
import {authenticate} from "../middlewares/authenticate.middleware.js"

const router = express.Router()


router.post("/signup", userSignUp)

router.post("/login", userLogin)

router.post("/logout", userLogout)

router.post("/user-update", authenticate, userUpdate)

router.get("/users", authenticate, getAllUsers)

router.get("/user/:id", authenticate, getUser)


export default router