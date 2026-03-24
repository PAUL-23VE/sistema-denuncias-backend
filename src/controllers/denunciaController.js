const crypto = require('crypto');
const { Op } = require('sequelize');
const { Denuncia } = require('../models');

const hashIP = (ip) =>
  crypto
    .createHash('sha256')
    .update(ip + (process.env.IP_SALT || 'salt_yura_2024'))
    .digest('hex');

// POST /api/denuncias
const crearDenuncia = async (req, res) => {
  try {
    const { tipo, descripcion, latitud, longitud } = req.body;

    if (!tipo || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ error: 'Faltan campos: tipo, latitud, longitud.' });
    }

    if (tipo === 'otro' && (!descripcion || descripcion.trim().length < 10)) {
      return res.status(400).json({ error: 'La descripción es obligatoria cuando el tipo es "otro" (mín. 10 caracteres).' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
    const ip_hash = hashIP(ip);

    const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
    const denunciaReciente = await Denuncia.findOne({
      where: { ip_hash, createdAt: { [Op.gte]: unaHoraAtras } },
    });

    if (denunciaReciente) {
      return res.status(429).json({
        error: 'Ya registraste una denuncia en la última hora. Intenta más tarde.',
      });
    }

    const denuncia = await Denuncia.create({
      tipo,
      descripcion: descripcion?.trim() || null,
      latitud,
      longitud,
      ip_hash,
    });

    res.status(201).json({
      mensaje: 'Denuncia registrada.',
      id: denuncia.id,
      createdAt: denuncia.createdAt,
    });
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// GET /api/denuncias
const obtenerDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      attributes: ['id', 'tipo', 'descripcion', 'latitud', 'longitud', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    res.json({ total: denuncias.length, denuncias });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { crearDenuncia, obtenerDenuncias };