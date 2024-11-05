import express from "express";
import { protectRoute,isAdminRoute } from "../middlewares/authMiddlewave.js";
import {
  getUserList,
  loginUser,
  logoutUser,
  registerUser,
  registerAdminUser,
  getMeUser
} from "../controllers/userController.js";
import {
  validateRegisterUser
} from '../validators/userValidator.js';
import { validate } from "../utils/index.js";


const router = express.Router();
router.get("/",protectRoute,isAdminRoute,getUserList)
router.get("/me",protectRoute,isAdminRoute,getMeUser)
router.post("/register", ...validateRegisterUser, validate, registerUser);
router.post("/admin-register", ...validateRegisterUser, validate, registerAdminUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


export default router;
