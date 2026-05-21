import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createIssue, getAllIssues, getIssueById } from "./issues.controller";

const router = Router();

router.post("/", authenticate, createIssue);

router.get("/", getAllIssues);
router.get("/:id", getIssueById);

export const issuesRoutes = router;

