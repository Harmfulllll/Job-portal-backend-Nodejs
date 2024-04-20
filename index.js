/*
 * Title: index.js
 * Description : Main file
 * Author: Tanvir Hassan Joy
 * Date: 2024-04-18 11:04:31
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";

import connectDB from "./database/db.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import jobRoute from "./routes/job.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

/* swagger config */
const options = {
  //
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job portal",
      description: "Backend for a job portal in node and express.js",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: [".routes/*.js"],
};

const spec = swaggerDoc(options);

/* configuration */
const app = express();
dotenv.config();

/* middleswares */

app.use(helmet());
app.use(express.json());
app.use(cors());

/* routes */
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/job", jobRoute);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
app.use(errorMiddleware);

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !", err);
  });
