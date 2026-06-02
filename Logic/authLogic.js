const crypto = require("crypto");
const {
  createUser,
  deleteUserById,
  findUserByUsername,
  getAllUsers,
  updateUserPassword,
} = require("../DAL/authDal");

function encodePassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  // Passwords are encoded with a salt, so the real password is not saved in SQL.
  return `pbkdf2$100000$${salt}$${hash}`;
}

function isEncodedPassword(passwordFromDatabase) {
  return typeof passwordFromDatabase === "string" && passwordFromDatabase.startsWith("pbkdf2$");
}

function passwordMatches(passwordFromUser, passwordFromDatabase) {
  if (!isEncodedPassword(passwordFromDatabase)) {
    return passwordFromUser === passwordFromDatabase;
  }

  const parts = passwordFromDatabase.split("$");
  const iterations = Number(parts[1]);
  const salt = parts[2];
  const savedHash = parts[3];
  const checkedHash = crypto.pbkdf2Sync(passwordFromUser, salt, iterations, 64, "sha512").toString("hex");
  // Login hashes the typed password and compares hashes instead of comparing real passwords.
  return crypto.timingSafeEqual(Buffer.from(savedHash, "hex"), Buffer.from(checkedHash, "hex"));
}

async function signupUser(username, password) {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return { status: 409, data: { message: "Username already exists" } };
  }

  await createUser(username, encodePassword(password));
  // Logic encodes the password first, then asks the DAL to save only the encoded value.
  return { status: 200, data: { message: "Signup completed" } };
}

async function loginUser(username, password) {
  const user = await findUserByUsername(username);
  if (!user || !passwordMatches(password, user.password)) {
    return { status: 401, data: { message: "Invalid username or password" } };
  }

  if (!isEncodedPassword(user.password)) {
    await updateUserPassword(user.id, encodePassword(password));
  }
  // Old plain-text passwords still work once, then logic upgrades them to encoded passwords.

  // Logic decides what login data the route should return after the DAL checks SQL.
  return {
    status: 200,
    data: { username: user.username, role: user.role || "user" },
  };
}

async function migrateUsers(users) {
  let saved = 0;

  for (const user of users) {
    if (!user.username || !user.password) {
      continue;
    }

    const existingUser = await findUserByUsername(user.username);
    if (!existingUser) {
      await createUser(user.username, encodePassword(user.password));
      saved++;
    }
  }

  // Migrated old localStorage users are encoded before the DAL saves them in SQL.
  return { status: 200, data: { saved } };
}

async function checkUserExists(username) {
  const user = await findUserByUsername(username);
  return { status: 200, data: { exists: Boolean(user) } };
}

async function getUsersForAdmin(adminUsername) {
  const adminUser = await findUserByUsername(adminUsername);
  if (!adminUser || adminUser.role !== "admin") {
    return { status: 403, data: { message: "Only admin can see users" } };
  }

  const users = await getAllUsers();
  // Logic checks admin permission first, then asks the DAL for the users list.
  return { status: 200, data: { users } };
}

async function deleteUserForAdmin(adminUsername, id) {
  const adminUser = await findUserByUsername(adminUsername);
  if (!adminUser || adminUser.role !== "admin") {
    return { status: 403, data: { message: "Only admin can delete users" } };
  }

  if (String(adminUser.id) === String(id)) {
    return { status: 400, data: { message: "Admin cannot delete itself" } };
  }

  const result = await deleteUserById(id);
  // Logic checks admin rules first, then asks the DAL to delete from SQL.
  return { status: 200, data: { deleted: result.changes > 0 } };
}

module.exports = {
  signupUser,
  loginUser,
  migrateUsers,
  checkUserExists,
  getUsersForAdmin,
  deleteUserForAdmin,
};
