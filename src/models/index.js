const sequelize = require('../config/database');
const Denuncia = require('./Denuncia');

// Aquí agregas más modelos en el futuro
const db = {
  sequelize,
  Denuncia,
};

module.exports = db;