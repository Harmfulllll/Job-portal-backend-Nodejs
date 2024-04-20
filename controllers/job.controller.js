import mongoose from "mongoose";
import jobModel from "../models/job.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const createJob = async (req, res) => {
  try {
    const { position, company } = req.body;
    if (!company || !position) {
      return res.json(new apiError(401, "Required fields missing"));
    }
    req.body.createdBy = req.user.userId;
    const newJob = await jobModel.create(req.body);
    return res.json(
      new apiResponse("200", { company, position }, "Job created successfully")
    );
  } catch (error) {
    res.json(new apiError(400, "Something went wrong"));
  }
};
//

const getAllJobs = async (req, res) => {
  const { status, search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  if (status) queryObject.status = status;
  if (search) queryObject.position = { $regex: search };

  let queryResult = await jobModel.find(queryObject);

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  // pagination

  const { page = 1, limit = 10 } = req.query;
  const jobs = queryResult.skip((page - 1) * limit).limit(limit);
  const totalJobs = await jobModel.countDocuments(jobs);

  return res.json(new apiResponse(200, queryResult, "Successfull"));
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
      return res.json(new apiError(401, "Required fields missing"));
    }

    const findJob = await jobModel.findOne({ _id: id });
    if (!findJob) return res.json(new apiError(404, "No job found"));

    if (req.user.userId == findJob.createdBy.tostring()) {
      return res.json(
        new apiError(402, "You are not authorized to perform this action")
      );
    }
    findJob.company = company;
    findJob.position = position;
    const updateJob = await findJob.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new apiResponse(200, { company, position }, "Job updated successfully")
      );
  } catch (err) {
    res.json(new apiError(400, "Something went wrong"));
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobModel.findById({ _id: id });

    if (!job) {
      return res.json(new apiError(404, "Job not found"));
    }

    if (req.user.userId !== job.createdBy.toString()) {
      return res.json(new apiError(403, "Unauthorized to delete this job"));
    }

    await jobModel.deleteOne({ _id: id });
    res.json(new apiResponse(200, {}, "Job deleted successfully"));
  } catch (error) {
    res.json(new apiError(400, "Something went wrong"));
  }
};

const jobStats = async (req, res) => {
  const stats = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Schema.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(
    new apiResponse(
      200,
      { total: stats.length, stats },
      "Data fetched successfully"
    )
  );
};

export { createJob, getAllJobs, updateJob, deleteJob, jobStats };
