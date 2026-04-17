import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const userId = await User.create(name, email, password, "student");
    const token = generateToken(userId, "student");
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, token, user: { id: userId, role: "student" } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user.user_id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      token,
      user: { id: user.user_id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

export const getMe = async (req, res, next) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
