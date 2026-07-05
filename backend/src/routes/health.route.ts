import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const router = Router();

// Route for health check
router.get("/health", getHealth);

export default router;
