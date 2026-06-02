const express = require("express");
const { getSpell } = require("../Logic/spellLogic");
const spellRouter = express.Router();

spellRouter.get("/:name", async (req, res) => {

    const spellName = req.params.name;

    const result = await getSpell(spellName);

    res.send(result);
});

module.exports = { spellRouter }