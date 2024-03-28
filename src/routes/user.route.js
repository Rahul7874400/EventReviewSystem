import { Router } from "express";
import { forgotPassword, 
    loginUser, 
    logoutUser, 
    registerUser, 
    updatePassword, 
    verifyEmail 
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secure route
router.route("/logout").post(verifyJwt , logoutUser)
router.route("/e/:token").post(verifyJwt , verifyEmail)
router.route("/f/:token").post(verifyJwt , forgotPassword)
router.route("/f/:token").patch(verifyJwt,updatePassword)



export default router