const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || 'default_salt_change_me';
  return crypto.createHash('sha256').update(String(ip) + salt).digest('hex');
}

const denunciaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  keyGenerator: (req /*, res*/) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    return hashIp(ip);
  },
  message: {
    error: 'Has enviado demasiadas denuncias. Intenta de nuevo en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

function anonymizeIpMiddleware(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
  req.anonymizedIp = hashIp(ip);
  next();
}

module.exports = { denunciaLimiter, hashIp, anonymizeIpMiddleware };