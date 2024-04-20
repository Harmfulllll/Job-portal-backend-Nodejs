import apiError from "../utils/apiError.js";
import userModel from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";

const updateUser = async (res, req, next) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.json(new apiError(401, "Please provide all the details"));
  }
  const user = await userModel.findOne({
    _id: req.user.userId,
  });
  user.name = name;
  user.email = email;

  await user.save();
  const token = user.generateJWT();
};

export default updateUser;
