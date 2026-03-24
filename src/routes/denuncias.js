const express = require('express');
const router = express.Router();
const { denunciaLimiter } = require('../middleware/rateLimiter');
const { crearDenuncia, obtenerDenuncias } = require('../controllers/denunciaController');

router.post('/', denunciaLimiter, crearDenuncia);
router.get('/', obtenerDenuncias);

module.exports = router;