const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.json({ success: true });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        message: 'Duplicate data'
      });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.loginUser(
      req.body.username,
      req.body.password
    );

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.user_role,
        username: user.user_username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.user_username,
        email: user.user_email,
        role: user.user_role
      }
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};