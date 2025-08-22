const pool = require('../../db'); // your pg Pool instance

async function getBoosterRules(){
    try {
        const result = await pool.query(
            `SELECT *
             FROM booster_score_roles`,
        );

        return result.rows;
    } catch (err) {
        console.error('Error in getUserBalanceByType:', err);
        throw err;
    }
}

module.exports = {
    getBoosterRules
}