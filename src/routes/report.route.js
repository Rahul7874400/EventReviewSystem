import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getReportedEvent, 
    toggleEventReport 
} from "../controllers/report.controller.js";


const router = Router()
router.use(verifyJwt)

router.route("/toggleEvent/:eventId/:userId").post(toggleEventReport)
router.route("/getevent/:userId").get(getReportedEvent)




export default router