import { Router } from "express";
import { 
    createTicketHandler,
    getAllTicketsHandler,
    getTicketByIdHandler,
    updateTicketHandler,
    deleteTicketHandler,
    getTicketUrgencyHandler
} from "../controllers/ticketController";

const router: Router = Router();

// Define routes for ticket operations
router.post("/tickets", createTicketHandler);
router.get("/tickets", getAllTicketsHandler);
router.get("/tickets/:id/urgency", getTicketUrgencyHandler);
router.get("/tickets/:id", getTicketByIdHandler);
router.put("/tickets/:id", updateTicketHandler);
router.delete("/tickets/:id", deleteTicketHandler);

export default router;

