import dotenv from "dotenv";
dotenv.config(); // Load .env file at the top

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Route imports
import userRouter from "./routes/user.route.js";
import pinRouter from "./routes/pin.route.js";
import commentRouter from "./routes/comment.route.js";
import boardRouter from "./routes/board.route.js";

// DB Connection
import connectDB from "./utils/connectDB.js";

const app = express();

// Debug: Check if .env loaded correctly
console.log("MONGO_URI is:", process.env.MONGO_URI);
console.log("CLIENT_URL is:", process.env.CLIENT_URL);

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(fileUpload());

// API Routes
app.use("/users", userRouter);
app.use("/pins", pinRouter);
app.use("/comments", commentRouter);
app.use("/boards", boardRouter);

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    status: err.status || 500,
    stack: process.env.NODE_ENV === "development" ? err.stack : "hidden",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB(); // Wait for DB connection
  console.log(`Server is running on http://localhost:${PORT}`);
});
