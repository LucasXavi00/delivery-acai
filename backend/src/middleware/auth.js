// ========================================
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// ========================================

import jwt from 'jsonwebtoken';
import { config } from '../config/app.config.js';
import logger from '../config/logger.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      logger.warn('Tentativa de acesso sem token', { rota: req.path });
      throw new AuthenticationError('Acesso negado. Token não fornecido.');
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        logger.warn('Token inválido ou expirado', {
          rota: req.path,
          erro: err.message
        });
        throw new AuthenticationError('Token inválido ou expirado.');
      }

      req.user = user;
      logger.debug('Usuário autenticado', { role: user.role });
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      logger.warn('Tentativa de acesso não autorizado', {
        rota: req.path,
        role: req.user.role
      });
      throw new AuthorizationError('Permissão insuficiente.');
    }
    next();
  } catch (error) {
    next(error);
  }
};
