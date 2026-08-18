// ========================================
// MIDDLEWARE DE SANITIZAÇÃO
// ========================================

import logger from '../config/logger.js';
import { ValidationError } from '../utils/errors.js';

export const sanitizeInput = (req, res, next) => {
  try {
    // Sanitizar string recursivamente
    const sanitizeValue = value => {
      if (typeof value === 'string') {
        return value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;')
          .trim();
      }

      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }

      if (typeof value === 'object' && value !== null) {
        const sanitized = {};
        Object.keys(value).forEach(key => {
          sanitized[key] = sanitizeValue(value[key]);
        });
        return sanitized;
      }

      return value;
    };

    if (req.body) {
      req.body = sanitizeValue(req.body);
    }

    logger.debug('Entrada sanitizada', { rota: req.path });
    next();
  } catch (error) {
    logger.error('Erro ao sanitizar entrada', { erro: error.message });
    next(new ValidationError('Erro ao processar dados de entrada'));
  }
};

export const validateRequired = fields => {
  return (req, res, next) => {
    const missing = fields.filter(field => !req.body[field]);

    if (missing.length > 0) {
      logger.warn('Campos obrigatórios faltando', {
        rota: req.path,
        faltando: missing
      });
      throw new ValidationError('Dados incompletos. Verifique os campos obrigatórios.', {
        campos_obrigatorios: fields,
        faltando: missing
      });
    }

    next();
  };
};
