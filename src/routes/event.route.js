import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { checkReportedEvent, 
    deleteEvent, 
    getEventByUserId, 
    organiseEvent 
} from "../controllers/event.controller.js";

const router = Router()

router.use(verifyJwt)

router.route("/organise/:userId").post(organiseEvent)
router.route("/delete/:eventId").delete(deleteEvent)
router.route("/get/:userId").get(getEventByUserId)
router.route("/check").patch(checkReportedEvent)




export default router