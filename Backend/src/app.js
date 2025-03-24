require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const { app } = require("./services/socket");
const  path  = require("path");
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend", "dist", "index.html"));
  });
}

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieparser());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);
module.exports = app;
