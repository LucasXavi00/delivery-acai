// ========================================
// CONFIGURAÇÃO CENTRALIZADA
// ========================================

export const config = {
  // Servidor
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Banco de dados
  database: {
    path: process.env.DATABASE_PATH || './banco.db'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key',
    expiresIn: '8h'
  },

  // Admin
  admin: {
    passwordHash: process.env.ADMIN_PASSWORD_HASH
  },

  // CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validar configurações críticas em produção
export const validateConfig = () => {
  if (config.isProduction) {
    const required = ['JWT_SECRET', 'ADMIN_PASSWORD_HASH', 'FRONTEND_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Variáveis de ambiente obrigatórias faltando: ${missing.join(', ')}`);
    }
  }
};
