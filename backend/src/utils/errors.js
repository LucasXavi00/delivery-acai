// ========================================
// CLASSES DE ERRO CUSTOMIZADAS
// ========================================

import { HTTP_STATUS } from '../constants.js';

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, meta = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      erro: this.message,
      tipo: this.name,
      codigo: this.statusCode,
      detalhes: this.meta
    };
  }
}

export class ValidationError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.BAD_REQUEST, meta);
  }
}

export class AuthenticationError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.UNAUTHORIZED, meta);
  }
}

export class AuthorizationError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.FORBIDDEN, meta);
  }
}

export class NotFoundError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.NOT_FOUND, meta);
  }
}

export class ConflictError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.CONFLICT, meta);
  }
}

export class DatabaseError extends AppError {
  constructor(message, meta = {}) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, meta);
  }
}
