const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(await User.findOne({ email })) return res.status(409).json({ error: 'Email já registrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, integrations: [] });
    await user.save();
    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if(!isValid) return res.status(401).json({ error: 'Senha incorreta' });
    const token = generateToken({ userId: user._id });
    return res.json({ token });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};
