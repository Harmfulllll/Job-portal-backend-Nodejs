import apiError from "../utils/apiError.js";
import userModel from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      throw new apiError(401, "All fields are mandaatory to fill");

    const userExists = await userModel.findOne({
      $or: [{ name }, { email }],
    });
    if (userExists) throw new apiError(409, "User already exists");

    const savedUser = await userModel.create({
      name,
      email,
      password,
    });
    const token = savedUser.generateJWT();

    return res
      .status(200)
      .json(new apiResponse(200, token, "User created successfully"));
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new apiError(401, "Email and password are required");

    const user = await userModel.findOne({ email });
    if (!user) throw new apiError(404, "User not found");

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) throw new apiError(401, "Invalid credentials");

    const token = user.generateJWT();

    return res
      .status(200)
      .json(new apiResponse(200, token, "Login successful"));
  } catch (err) {
    next(err);
  }
};
export { registerUser, loginUser };
