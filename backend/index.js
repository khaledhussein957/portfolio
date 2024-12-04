
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/database/mongoDB.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: "50mb" })); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);


app.listen(PORT, () => {
	connectDB();
	console.log(`Server running on port ${PORT}`);
});
