import User from "../models/User.js";

export const listUsers = async (req, res) => {
  const users = await User.getAll();
  res.render("admin/users", { users });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  await User.updateRole(req.params.id, role);
  res.redirect("/admin/users");
};

export const deleteUser = async (req, res) => {
  await User.delete(req.params.id);
  res.redirect("/admin/users");
};
