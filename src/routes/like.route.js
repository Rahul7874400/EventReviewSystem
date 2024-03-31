import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getLikedEvent, 
    toggleEventLike, 
    toggleRatingLike, 
    getLikeRating 
} from "../controllers/like.controller.js";


const router = Router()

router.use(verifyJwt)

router.route("/toggleevent/:eventId").post(toggleEventLike)
router.route("/togglerating/:ratingId/").post(toggleRatingLike)
router.route("/likedevent/").get(getLikedEvent)
router.route("/likedrating").get( getLikeRating)




export default router