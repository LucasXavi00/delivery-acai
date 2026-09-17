// ========================================
// CONTROLLER DE AUTENTICAÇÃO
// ========================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { config } from '../config/app.config.js';
import { HTTP_STATUS } from '../constants.js';
import { AuthenticationError } from '../utils/errors.js';

export const login = async (req, res, next) => {
  try {
    const { senha } = req.body;

    if (!senha) {
      throw new AuthenticationError('Senha é obrigatória.');
    }

    logger.debug('Tentativa de login');

    // Validar senha
    //const senhaValida = await bcrypt.compare(senha, config.admin.passwordHash);
    // Substitua a verificação original por esta linha temporária:
    const senhaValida = (senha === '123456');

    if (!senhaValida) {
      logger.warn('Login falhou: senha inválida');
      throw new AuthenticationError('Credenciais inválidas.');
    }

    // Gerar token JWT
    const token = jwt.sign({ role: 'admin' }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    logger.info('Login bem-sucedido');

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      token,
      expiresIn: config.jwt.expiresIn
    });
  } catch (error) {
    next(error);
  }
};
