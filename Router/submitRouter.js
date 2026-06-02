const express = require("express");
const { returnSubmitLength, deleteName, updateRole } = require("../Logic/submitLogic");
// Fixed folder casing for Linux/Render, where "Logic" and "logic" are different paths.
const router = express.Router();

router.post("/", async function (req, res) {
  const data = req.body;
  const names = await returnSubmitLength(data);
  res.send({ data: names });
});

router.delete("/:id", async function (req, res) {
  const data = req.body;
  const id = req.params.id;
  const result = await deleteName(id);
  res.send({ data: result });
});

router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const newRole = req.body.role;
  const result = await updateRole(id, newRole);
  res.send({ data: result });
});

module.exports = router;
