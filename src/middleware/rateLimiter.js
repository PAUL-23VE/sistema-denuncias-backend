const rateLimit = require('express-rate-limit');

const denunciaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Has enviado demasiadas denuncias. Intenta de nuevo en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { denunciaLimiter };