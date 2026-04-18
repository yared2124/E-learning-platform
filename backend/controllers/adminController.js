import User from "../models/User.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    await User.updateRole(req.params.id, req.body.role);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
