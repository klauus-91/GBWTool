// Simple in-memory store for pending applications
const pendingApplications = new Map();

/**
 * Save an application
 * @param {string} userId - Discord user ID
 * @param {Object} data - Data to store (raiderIO, boostType, etc.)
 */
function saveApplication(userId, data) {
    pendingApplications.set(userId, data);
}

/**
 * Get an application
 * @param {string} userId - Discord user ID
 * @returns {Object|null} - stored data or null
 */
function getApplication(userId) {
    return pendingApplications.get(userId) || null;
}

/**
 * Remove an application after processing
 * @param {string} userId - Discord user ID
 */
function removeApplication(userId) {
    pendingApplications.delete(userId);
}

const claims = new Map();

function setClaim(customerId, advertiserId) {
    claims.set(customerId, { customerId, advertiserId });
}

function getClaim(customerId) {
    return claims.get(customerId);
}

function removeClaim(customerId) {
    claims.delete(customerId);
}


module.exports = {
    saveApplication,
    getApplication,
    removeApplication,
    setClaim,
    getClaim,
    removeClaim
};
