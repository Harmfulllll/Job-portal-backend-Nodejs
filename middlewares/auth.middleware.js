import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import user from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
  try {
    const authHeadeer = req.header("Authorization")?.replace("Bearer", "");

    if (!authHeadeer) return res.json(new apiError(401, "Unauthorized access"));

    const decodedToken = jwt.decode(authHeadeer, process.env.JWT_SECRET);
    const findUser = user.findById(decodedToken?._id).select("-password");

    if (!findUser) {
      return res.json(new apiError(401, "Invalid token"));
    }
    req.user = findUser;
    next();
  } catch (error) {
    res.json(new apiError(401, error?.message || "Invalid access token"));
  }
};

export default verifyUser;
