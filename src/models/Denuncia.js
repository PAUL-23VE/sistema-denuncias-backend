const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Denuncia = sequelize.define('Denuncia', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM(
      'robo',
      'vandalismo',
      'iluminacion_deficiente',
      'zona_peligrosa',
      'trafico_drogas',
      'accidente',
      'pelea',
      'persona_sospechosa',
      'otro'
    ),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true, // solo obligatorio si tipo = 'otro'
    validate: {
      longitudSegunTipo(value) {
        if (this.tipo === 'otro' && (!value || value.trim().length < 10)) {
          throw new Error('La descripción es obligatoria cuando el tipo es "otro" (mín. 10 caracteres).');
        }
        if (value && value.length > 500) {
          throw new Error('La descripción no puede superar 500 caracteres.');
        }
      },
    },
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: { min: -90, max: 90 },
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: { min: -180, max: 180 },
  },
  ip_hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
}, {
  tableName: 'denuncias',
  timestamps: true,
});

module.exports = Denuncia;