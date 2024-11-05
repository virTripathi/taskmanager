import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  assignTask,
  updateTaskStatus
} from "../controllers/taskController.js";
import {
  validateCreateTask
  ,validateGetTasks
  ,validateGetTask
  ,validateUpdateTask
  ,validateUpdateTaskStatus
  ,validateAssignTask 
  ,validateDeleteTask
} from '../validators/taskValidator.js';
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
import { validate } from "../utils/index.js";

const router = express.Router();

router.post("/create", protectRoute,validateCreateTask, validate, isAdminRoute, createTask);
router.get("/", protectRoute,validateGetTasks, validate, getTasks);
router.get("/:id", protectRoute,validateGetTask, validate, getTask);
router.put("/update/:id", protectRoute,validateUpdateTask, validate, isAdminRoute, updateTask);
router.put("/:id/status/:slug", protectRoute,validateUpdateTaskStatus, validate, updateTaskStatus);
router.put("/assign/:id", protectRoute,validateAssignTask, validate, isAdminRoute, assignTask);
router.delete(
  "/:id",
  protectRoute,validateDeleteTask, validate,
  isAdminRoute,
  deleteTask
);

export default router;
