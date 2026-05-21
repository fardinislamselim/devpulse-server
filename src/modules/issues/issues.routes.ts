import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createIssue, getAllIssues } from "./issues.controller";

const router = Router();

router.post("/", authenticate, createIssue);
router.get("/", getAllIssues);

export const issuesRoutes = router;

