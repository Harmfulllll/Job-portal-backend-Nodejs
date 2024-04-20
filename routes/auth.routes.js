import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", verifyUser, loginUser);
export default router;
