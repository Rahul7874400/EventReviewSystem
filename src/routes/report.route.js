import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getReportedEvent, 
    toggleEventReport 
} from "../controllers/report.controller.js";


const router = Router()
router.use(verifyJwt)

router.route("/toggleEvent/:eventId").post(toggleEventReport)
router.route("/getevent/").get(getReportedEvent)




export default router