// ========================================
// MIDDLEWARE DE TRATAMENTO DE ERROS
// ========================================

import logger from '../config/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants.js';
import { AppError } from '../utils/errors.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  logger.error('Erro capturado', {
    mensagem: err.message,
    tipo: err.name,
    rota: `${req.method} ${req.path}`
  });

  // Se for um erro customizado, retornar estruturado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Se for erro de validação do Express
  if (err.status && err.body) {
    return res.status(err.status).json({
      erro: 'Dados inválidos',
      tipo: 'ValidationError',
      codigo: err.status,
      detalhes: err.body
    });
  }

  // Erro genérico
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    erro: ERROR_MESSAGES.INTERNAL_ERROR,
    tipo: 'InternalServerError',
    codigo: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    detalhes: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    erro: 'Rota não encontrada',
    tipo: 'NotFoundError',
    codigo: HTTP_STATUS.NOT_FOUND,
    rota: `${req.method} ${req.path}`
  });
};
