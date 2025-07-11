exports.validatePhone = (req, res, next) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  next();
};