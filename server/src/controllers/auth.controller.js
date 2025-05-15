import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "Opps, pls fill in all fields here." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Pls be aware that password must be at least 8 characters.",
      });
    }

    // Validate email format using a regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Opps, email already exists, pls use another one" });
    }

    // Generate new user avatar URL
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomProfilePic = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomProfilePic,
    });

    const jwtToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("jwt", jwtToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  res.send("Login route");
}
export function logout(req, res) {
  res.send("Logout route");
}
