const { getSpellFromDB, insertSpell } = require("../DAL/spellDal");


async function getSpell(name) {

    // Check database first
    const existingSpell = await getSpellFromDB(name);

    if (existingSpell) {
        console.log("Spell exists in DB - no need for API")
        return JSON.parse(existingSpell.data);
    }
    console.log("Spell doesn't exist in DB - Getting spell")
    // Load from API
    const response = await fetch(
        "https://www.dnd5eapi.co/api/spells/" + name
    );

    const spellData = await response.json();

    // Save into DB
    await insertSpell(name, JSON.stringify(spellData));

    return spellData;
}

module.exports = { getSpell };