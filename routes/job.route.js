import express from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  jobStats,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create-job", verifyUser, createJob);
router.get("/get-job", verifyUser, getAllJobs);
router.patch("/update-job/:id", verifyUser, updateJob);
router.delete("/delete-job/:id", verifyUser, deleteJob);
router.get("/job-stats", verifyUser, jobStats);
export default router;
