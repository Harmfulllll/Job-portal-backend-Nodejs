import express from "express";
import updateUser from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/update", verifyUser, updateUser);
export default router;
