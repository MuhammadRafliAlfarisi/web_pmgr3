import express from "express";
import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

import configureMiddleware from "../config/middleware.js";

const app = express();
configureMiddleware(app);
const router = express.Router();


router.post("/registration", async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;


    if (confirmPassword !== password) {
      return res.status(400).json({
        status: "error",
        message: "Password and Confirm Password do not match",
      });
    }

    // Cek apakah npm sudah terdaftar sebelumnya
    const { data: existingUser, error: selectError } = await supabase.from("users").select("username").eq("username", username).limit(1);

    if (selectError) {
      throw selectError;
    }

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "username already exists",
      });  
    }

    // Enkripsi password sebelum disimpan
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user baru ke database
    const { data, error: insertError } = await supabase
      .from("users")
      .insert({
        username: username,
        password: hashedPassword,
      })
      .select("*");

    if (insertError) {
      throw insertError;
    }

    const userId = data[0].id_user;
    return res.json({
      success: true,
      message: "Account Created Successfully",
      userId: userId,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});



router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    // Check if user exists in the database
    const { data: users, error } = await supabase.from("users").select("*").eq("username", username).limit(1);

    if (error) {
      throw new Error("Failed to fetch user");
    }

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];
    console.log(user);

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id_user,
        username: user.username,
      },
      "your-secret-key",
      {
        expiresIn: "12h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.json({
      success: true,
      message: `Welcome to WEB, ${user.username}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

export default router;
