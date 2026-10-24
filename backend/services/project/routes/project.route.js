
import express from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    getStarredProject,
    toggleStarredProject,
    deleteProject
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/starred", getStarredProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", toggleStarredProject);
router.delete("/:id", deleteProject);

export default router;
