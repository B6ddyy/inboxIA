const jwt = require('jsonwebtoken');
module.exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({ error: 'Token não informado' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
