const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 🧾 REGISTER
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO tbl_users 
      (user_username, user_password, user_role, user_status) 
      VALUES ($1,$2,$3,0)`,
      [username, hashed, role || 'user']
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Register error' });
  }
};



// 🔑 LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM tbl_users WHERE user_username=$1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // 🔒 locked check
    if (user.user_is_locked) {
      return res.status(403).json({ message: 'Account locked' });
    }

    // ⛔ pending user
    if (user.user_status === 0) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // ⛔ rejected (optional)
    if (user.user_status === 2) {
      return res.status(403).json({ message: 'Account rejected' });
    }

    // 🔐 password compare
    const isMatch = await bcrypt.compare(password, user.user_password);

    if (!isMatch) {
      // ❌ increase attempts
      await pool.query(
        `UPDATE tbl_users 
         SET user_failed_attempts = user_failed_attempts + 1 
         WHERE user_id=$1`,
        [user.user_id]
      );

      // 🔒 lock if >=3
      if (user.user_failed_attempts + 1 >= 3) {
        await pool.query(
          `UPDATE tbl_users 
           SET user_is_locked=true 
           WHERE user_id=$1`,
          [user.user_id]
        );
      }

      return res.status(401).json({ message: 'Wrong password' });
    }

    // ✅ reset attempts
    await pool.query(
      `UPDATE tbl_users 
       SET user_failed_attempts=0 
       WHERE user_id=$1`,
      [user.user_id]
    );

    // 🎟️ JWT
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.user_role,
        username: user.user_username
      },
      'SECRET_KEY',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: user.user_role,
      username: user.user_username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Login error' });
  }
};