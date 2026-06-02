const {
  insertNewName,
  getAllNames,
  checkIfNameExists,
  checkIfIdExists,
  deleteNameById,
  changeRoleById,
} = require("../dal/usersDal");

async function returnSubmitLength(data) {
  let name = data.name;
  if (name.length < 20) {
    const nameExists = await checkIfNameExists(name);
    if (nameExists) {
      return "Name already exists";
    }
    const result = await insertNewName(name);
    if (result.changes) {
      const allNames = await getAllNames();
      return allNames;
    }
  } else {
    return "Too long";
  }
}

async function deleteName(id) {
  const isExist = await checkIfIdExists(id);
  if (!isExist) {
    return "ID does not exist";
  } else {
    const result = await deleteNameById(id);
    if (result.changes) {
      return "Name deleted successfully";
    } else {
      return "Failed to delete name";
    }
  }
}

async function updateRole(id, newRole) {
  const isExist = await checkIfIdExists(id);
  if (!isExist) {
    return "ID does not exist";
  } else {
    if (newRole !== "user" && newRole !== "admin") {
      return "Invalid role";
    }
    const result = await changeRoleById(id, newRole);
    if (result.changes) {
      return "Role updated successfully";
    } else {
      return "Failed to update role";
    }
  }
}

module.exports = { returnSubmitLength, deleteName, updateRole };
