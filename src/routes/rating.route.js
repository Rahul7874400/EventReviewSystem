import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addRating, 
    deleteRating, 
    getEventRating, 
    updateRating 
} from "../controllers/rating.controller.js";


const router = Router()
router.use(verifyJwt)

router.route("/add/:eventId").post(addRating)
router.route("/delete/:eventId").delete(deleteRating)
router.route("/update/:eventId").patch(updateRating)
router.route("/getrating/:eventId").get(getEventRating)




export default router