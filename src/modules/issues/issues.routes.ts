import { Router } from "express";
import { authenticate, authorise } from "../../middlewares/auth";
import { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssue } from "./issues.controller";

const router = Router();

router.post("/", authenticate, createIssue);

router.get("/", getAllIssues);
router.get("/:id", getIssueById);

router.patch("/:id", authenticate, updateIssue);

router.delete("/:id", authenticate, authorise("maintainer"), deleteIssue);

export const issuesRoutes = router;
