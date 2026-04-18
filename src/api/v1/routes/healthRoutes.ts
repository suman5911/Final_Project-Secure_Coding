import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Represents the response structure for a health check endpoint
 */
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

const router: Router = Router();

router.get("/health", (req: Request, res: Response) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    };
    
    res.status(HTTP_STATUS.OK).json(healthData);
});
    
export default router;