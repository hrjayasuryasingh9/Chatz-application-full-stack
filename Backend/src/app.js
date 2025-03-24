import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app } from "./services/socket.js";

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend", "dist", "index.html"));
  });
}

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin:"*",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

export default app;
