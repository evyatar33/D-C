const express = require("express");
const {
  checkUserExists,
  deleteUserForAdmin,
  getUsersForAdmin,
  loginUser,
  migrateUsers,
  signupUser,
} = require("../Logic/authLogic");

const router = express.Router();

router.post("/signup", async function (req, res) {
  const { username, password } = req.body;

  try {
    const result = await signupUser(username, password);
    // Router now asks authLogic first; authLogic asks the DAL, and the DAL talks to SQL.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const result = await loginUser(username, password);
    // Router keeps the HTTP work, while authLogic handles the login decision.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/migrate", async function (req, res) {
  const users = Array.isArray(req.body.users) ? req.body.users : [];

  try {
    const result = await migrateUsers(users);
    // Router sends the users to authLogic; authLogic decides what to migrate through the DAL.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/users/:username", async function (req, res) {
  try {
    const result = await checkUserExists(req.params.username);
    // Router no longer checks the DAL directly; authLogic checks if the SQL user exists.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/admin/users", async function (req, res) {
  try {
    const result = await getUsersForAdmin(req.query.adminUsername);
    // Admin permission is now checked in authLogic before the DAL gets all users.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

router.delete("/admin/users/:id", async function (req, res) {
  try {
    const result = await deleteUserForAdmin(req.body.adminUsername, req.params.id);
    // Admin delete rules are now in authLogic; the DAL only performs the SQL delete.
    res.status(result.status).send(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
