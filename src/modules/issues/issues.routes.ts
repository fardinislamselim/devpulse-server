import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createIssue } from "./issues.controller";

const router = Router();

router.post("/", authenticate, createIssue);

export const issuesRoutes = router;

