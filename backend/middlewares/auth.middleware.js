const jwt = require('jsonwebtoken');
const SECRET = 'votre_clé_secrète_jwt';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: "Token manquant" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalide" });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
