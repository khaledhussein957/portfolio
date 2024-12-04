
import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
import cookieParser from "cookie-parser";
// import path from "path";

import connectDB from "./src/config/database/mongoDB.js";

import authRoutes from "./src/routes/authRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// const __dirname = path.resolve();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "50mb" })); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

app.listen(PORT, () => {
	connectDB();
	console.log(`Server running on port ${PORT}`);
});
