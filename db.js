const { Pool } = require('pg');

const pool = new Pool({
    user: 'goboost_user',
    host: '68.183.214.3',
    database: 'goboostwow',
    password: 'Realmadrid4*',
    port: 5432,
});

// Optional: test connection at startup
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL via pool');
        client.release();
    })
    .catch(err => console.error('PostgreSQL pool connection error:', err));

module.exports = pool;