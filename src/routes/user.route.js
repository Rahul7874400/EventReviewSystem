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
router.route("/forgotpassword").post(forgotPassword)
// secure route
router.route("/logout").post(verifyJwt , logoutUser)
router.route("/e/:token").post(verifyJwt , verifyEmail)

router.route("/f/:token").patch(verifyJwt,updatePassword)



export default router