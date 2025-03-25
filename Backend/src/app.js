import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3005",
    ],
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

// **Serve static files only in production**
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../../Frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
console.log("Environment:", process.env.NODE_ENV);

export default app;
