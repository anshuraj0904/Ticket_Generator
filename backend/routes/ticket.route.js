import express from "express" 
import {createTicket, getTicket, getTickets} from "../controllers/ticket.controller.js"
import { authenticate } from "../middlewares/authenticate.middleware.js"

const router = express.Router()

router.post("/",authenticate,  createTicket)
router.get("/", authenticate,getTickets)
router.get("/:id", authenticate, getTicket)


export default router