// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';
import { sanitizeInput, validateRequired } from '../middleware/validation.js';
import { config } from '../config/app.config.js';

const router = express.Router();

// Rate limiter para login em desenvolvimento
// Em dev, é mais útil manter o login liberado para testes e ajustes.
const loginLimiter = config.isDevelopment
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxAttempts,
      message: { erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
    });

/**
 * POST /api/auth/login
 * Autenticar admin/cozinha
 * Body: { senha: string }
 * Response: { sucesso: true, token: string }
 */
router.post('/login', loginLimiter, sanitizeInput, validateRequired(['senha']), login);

export default router;
