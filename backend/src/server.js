// ========================================
// SERVIDOR PRINCIPAL - NOVA ARQUITETURA
// ========================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './config/logger.js';
import { config, validateConfig } from './config/app.config.js';
import { initializeDatabase, closeDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import pedidosRoutes from './routes/pedidos.js';

const app = express();

// ========================================
// 1. VALIDAÇÕES INICIAIS
// ========================================
try {
  validateConfig();
  logger.info('✅ Configurações validadas com sucesso');
} catch (error) {
  logger.error('Erro de configuração', { erro: error.message });
  process.exit(1);
}

// ========================================
// 2. MIDDLEWARE GLOBAL
// ========================================
app.use(cors(config.cors));
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// ========================================
// 3. ROTAS DA API
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// ========================================
// 4. TRATAMENTO DE ERROS
// ========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ========================================
// 5. INICIALIZAÇÃO DO SERVIDOR
// ========================================
const startServer = async () => {
  try {
    // Conectar ao banco
    await initializeDatabase();

    // Iniciar servidor
    app.listen(config.port, () => {
      logger.info(`🚀 Servidor rodando em http://localhost:${config.port}`);
      logger.info(`📚 Documentação: http://localhost:${config.port}/api/docs`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor', { erro: error.message });
    process.exit(1);
  }
};

// ========================================
// 6. TRATAMENTO DE SINAIS (GRACEFUL SHUTDOWN)
// ========================================
const gracefulShutdown = async signal => {
  logger.warn(`Recebido sinal ${signal}. Encerrando gracefully...`);

  try {
    await closeDatabase();
    logger.info('Banco de dados fechado');

    process.exit(0);
  } catch (error) {
    logger.error('Erro ao encerrar', { erro: error.message });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Iniciar!
startServer();
