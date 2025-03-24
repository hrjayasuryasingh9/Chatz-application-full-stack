import jwt from "jsonwebtoken";
import * as userServices from "../services/userServices.js";

const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const email = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email.email);
    const user = await userServices.getuserdata(email.email);
    req.user = user;

    next();
  } catch (error) {
    res.status(402).json({ message: "Internal server error" });
  }
};

export { protectRoute };
