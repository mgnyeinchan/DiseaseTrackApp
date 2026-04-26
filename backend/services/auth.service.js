const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

exports.registerUser = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return userModel.createUser({
    ...data,
    password: hashed,
    role: data.role || 'user'
  });
};

exports.loginUser = async (username, password) => {
  const user = await userModel.findByUsername(username);

  if (!user) throw new Error('User not found');

  if (user.user_is_locked) throw new Error('Account locked');
  if (user.user_status === 0) throw new Error('Pending approval');
  if (user.user_status === 2) throw new Error('Rejected');

  const isMatch = await bcrypt.compare(password, user.user_password);

  if (!isMatch) {
    await userModel.incrementFailedAttempts(user.user_id);

    if (user.user_failed_attempts + 1 >= 3) {
      await userModel.lockUser(user.user_id);
    }

    throw new Error('Wrong password');
  }

  await userModel.resetAttempts(user.user_id);

  return user;
};