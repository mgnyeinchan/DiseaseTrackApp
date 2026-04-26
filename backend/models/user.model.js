const pool = require('./db');

exports.findByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM tbl_users WHERE user_username=$1',
    [username]
  );
  return result.rows[0];
};

exports.createUser = async ({ username, email, phone, password, role }) => {
  return pool.query(
    `INSERT INTO tbl_users 
    (user_username, user_email, user_phone, user_password, user_role, user_status) 
    VALUES ($1,$2,$3,$4,$5,0)`,
    [username, email, phone, password, role]
  );
};

exports.incrementFailedAttempts = async (user_id) => {
  return pool.query(
    `UPDATE tbl_users 
     SET user_failed_attempts = user_failed_attempts + 1 
     WHERE user_id=$1`,
    [user_id]
  );
};

exports.lockUser = async (user_id) => {
  return pool.query(
    `UPDATE tbl_users 
     SET user_is_locked=true 
     WHERE user_id=$1`,
    [user_id]
  );
};

exports.resetAttempts = async (user_id) => {
  return pool.query(
    `UPDATE tbl_users 
     SET user_failed_attempts=0 
     WHERE user_id=$1`,
    [user_id]
  );
};