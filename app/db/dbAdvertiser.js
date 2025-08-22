const pool = require('../../db'); // adjust path if needed

/**
 * Add a new advertiser to the database
 * @param {Object} adv - Advertiser data
 * @param {string|number} adv.userId - Discord user ID
 * @param {string} adv.raiderIo - Raider.IO link
 * @param {string} adv.battleTag - Discord BattleTag
 * @param {string} adv.vouch - Optional vouch info
 * @param {number} adv.accountNumber - Number of accounts
 * @param {string} adv.boostType - Type of boost advertised
 */
async function addAdv({ userId, raiderIo, battleTag, vouch, accountNumber, boostType }) {
    const query = `
        INSERT INTO advertiser (user_id, raider_io, battle_tag, vouch, account_number, boost_type)
        VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id) DO UPDATE
                                         SET raider_io = EXCLUDED.raider_io,
                                         battle_tag = EXCLUDED.battle_tag,
                                         vouch = EXCLUDED.vouch,
                                         account_number = EXCLUDED.account_number,
                                         boost_type = EXCLUDED.boost_type
                                         RETURNING *;
    `;

    const values = [userId, raiderIo, battleTag, vouch, accountNumber, boostType];

    try {
        const res = await pool.query(query, values);
        console.log(`Advertiser added/updated: ${res.rows[0].id}`);
        return res.rows[0];
    } catch (err) {
        console.error('Error adding/updating advertiser:', err);
        throw err;
    }
}

module.exports = {
    addAdv
};
