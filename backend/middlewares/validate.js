const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

exports.validateRegister = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  next();
};

exports.validateLogin = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  next();
};