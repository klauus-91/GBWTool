const pool = require('../../db'); // Adjust path if needed

/**
 * Add a new booster to the database
 * @param {string} user_id - Discord user ID
 * @param {string} user_name - Discord username#tag
 * @param {string} raider_io - Raider.IO link
 * @param {number} score - RIO score
 */
async function addBooster({ userId, userName, raiderIo, score }) {
    try {
        await pool.query(
            `INSERT INTO boosters (user_id, user_name, raider_io, score)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id) DO UPDATE 
             SET user_name = EXCLUDED.user_name,
                 raider_io = EXCLUDED.raider_io,
                 score = EXCLUDED.score`,
            [userId, userName, raiderIo, score]
        );
    } catch (error) {
        console.error('Error in addBooster:', error);
        throw error;
    }
}
module.exports = {
    addBooster
};
