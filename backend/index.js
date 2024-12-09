import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./src/config/database/mongoDB.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/skill", skillRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log(`Server running on port ${PORT}`);
});
