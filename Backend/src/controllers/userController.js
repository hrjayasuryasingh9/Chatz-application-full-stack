import * as userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import v2 from "../services/Cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hrjayasuryasingh@gmail.com",
    pass: process.env.MAILER,
  },
});
const JWT_SECRET = process.env.JWT_SECRET;

const userRegistration = async (req, res) => {
  let { fullName, email, password } = req.body;
  const is_verified = false;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Please enter password with more than 6 characters" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await userServices.registration(
      fullName,
      email,
      hashedPassword,
      is_verified,
      verificationToken
    );
    const verificationLink = `http://localhost:3006/api/user/verify?token=${verificationToken}`;
    const mailOptions = {
      from: '"Chat-app" <hrjayasuryasingh@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "Registration successful. Check your email for verification.",
    });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "User with this email already exists" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const userVerification = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Invalid verification link" });
  }
  try {
    const result = await userServices.verification(token);
    if (result === "invalid or expired token") {
      res.status(500).json({ message: "invalid or expired token" });
    } else {
      res.send("<h2>Email verified successfully! You can now log in.</h2>");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter the data in all the given fields" });
  }
  try {
    const user = await userServices.getuserdata(email);
    if (user) {
      if (user.is_verified == false) {
        return res
          .status(404)
          .json({ message: "Please verify your email before login." });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.hashpassword
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      generateJWT(user.email, user.id, res);
      res.status(200).json({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        profile_pic: user.profile_pic,
        created_at: user.created_at,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateJWT = (email, userID, res) => {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};

const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userid = req.user.id;
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic requires" });
    }
    const uploadResponse = await v2.uploader.upload(profilePic);
    const updateProfile = await userServices.updateProfile(
      userid,
      uploadResponse.secure_url
    );
    res.status(200).json(updateProfile);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  userRegistration,
  userVerification,
  userLogin,
  userLogout,
  updateProfile,
  checkAuth,
};
