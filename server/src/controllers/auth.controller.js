// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { upsertStreamUser } from "../config/stream.js";
// import { uploadToCloudinary } from "../config/cloudinary.js";

// export async function signup(req, res) {
//   const { email, password, fullName } = req.body;

//   try {
//     if (!email || !password || !fullName) {
//       return res
//         .status(400)
//         .json({ message: "Opps, pls fill in all fields here" });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({
//         message: "Pls be aware that password must be at least 8 characters",
//       });
//     }

//     // Validate email format using a regex
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Opps, email already exists, pls use another one" });
//     }

//     // Generate new user avatar URL
//     const idx = Math.floor(Math.random() * 100) + 1;
//     const randomProfilePic = `https://avatar.iran.liara.run/public/${idx}.png`;

//     const newUser = await User.create({
//       email,
//       fullName,
//       password,
//       profilePic: randomProfilePic,
//     });

//     // Upsert the user in Stream
//     try {
//       await upsertStreamUser({
//         id: newUser._id.toString(),
//         name: newUser.fullName,
//         image: newUser.profilePic || "",
//       });
//       console.log(`Stream user successfully created for ${newUser.fullName}`);
//     } catch (error) {
//       console.log("Error creating Stream user:", error);
//     }

//     const jwtToken = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//       }
//     );

//     res.cookie("jwt", jwtToken, {
//       maxAge: 2 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(201).json({ success: true, user: newUser });
//   } catch (error) {
//     console.log("Error in signup controller", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Opps, pls fill in all fields here" });
//     }

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const isPasswordCorrect = await user.matchPassword(password);
//     if (!isPasswordCorrect)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const jwtToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//       }
//     );

//     res.cookie("jwt", jwtToken, {
//       maxAge: 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
// export function logout(req, res) {
//   res.clearCookie("jwt");
//   res
//     .status(200)
//     .json({ success: true, message: "You have been Logout successfully" });
// }

// export async function onboard(req, res) {
//   try {
//     const userId = req.user._id;
//     const { fullName, bio, nativeLanguage, learningLanguage, location } =
//       req.body;

//     if (
//       !fullName ||
//       !bio ||
//       !nativeLanguage ||
//       !learningLanguage ||
//       !location
//     ) {
//       return res.status(400).json({
//         message: "All fields are required",
//         missingFields: [
//           !fullName && "fullName",
//           !bio && "bio",
//           !nativeLanguage && "nativeLanguage",
//           !learningLanguage && "learningLanguage",
//           !location && "location",
//         ].filter(Boolean),
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         ...req.body,
//         isOnboarded: true,
//       },
//       { new: true }
//     );

//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });

//     try {
//       await upsertStreamUser({
//         id: updatedUser._id.toString(),
//         name: updatedUser.fullName,
//         image: updatedUser.profilePic || "",
//       });
//       console.log(
//         `Stream user updated after onboarding for ${updatedUser.fullName}`
//       );
//     } catch (streamError) {
//       console.log(
//         "Error updating Stream user during onboarding:",
//         streamError.message
//       );
//     }
//     res.status(200).json({
//       success: true,
//       message: "Onboarding completed successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log("Error in onboarding controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../config/stream.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "Opps, pls fill in all fields here" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Pls be aware that password must be at least 8 characters",
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

    // Upsert the user in Stream
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user successfully created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const jwtToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("jwt", jwtToken, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Opps, pls fill in all fields here" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("jwt", jwtToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res
    .status(200)
    .json({ success: true, message: "You have been Logout successfully" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, image } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    let imageData = {};
    if (image) {
      try {
        imageData = await uploadToCloudinary(image, "my-profile");
      } catch (cloudErr) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const updateFields = {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      isOnboarded: true,
    };

    if (image && imageData.url) {
      updateFields.profilePic = imageData.url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }
    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in onboarding controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
