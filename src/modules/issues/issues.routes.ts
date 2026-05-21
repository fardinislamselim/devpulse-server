import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createIssue, getAllIssues, getIssueById, updateIssue } from "./issues.controller";

const router = Router();

router.post("/", authenticate, createIssue);

router.get("/", getAllIssues);
router.get("/:id", getIssueById);

router.patch("/:id", authenticate, updateIssue);

export const issuesRoutes = router;

