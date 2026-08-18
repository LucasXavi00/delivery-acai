// ========================================
// CONEXÃO CENTRALIZADA AO BANCO DE DADOS
// ========================================

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import logger from '../config/logger.js';
import { config } from '../config/app.config.js';
import { DatabaseError } from '../utils/errors.js';

let db = null;

export const initializeDatabase = async () => {
  try {
    const dbPath = path.resolve(config.database.path);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    logger.info('✅ Banco de dados inicializado', { database: dbPath });

    // Criar tabelas se não existirem
    await createTables();

    return db;
  } catch (error) {
    logger.error('Erro ao inicializar banco de dados', { error: error.message });
    throw new DatabaseError('Falha ao conectar ao banco de dados');
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new DatabaseError('Banco de dados não inicializado');
  }
  return db;
};

const createTables = async () => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT NOT NULL,
        endereco TEXT NOT NULL,
        pagamento TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pendente',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS itens_pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        produto TEXT NOT NULL,
        base TEXT NOT NULL,
        complementos TEXT,
        valor REAL NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
      );
    `);

    logger.info('Tabelas do banco de dados criadas/verificadas');
  } catch (error) {
    logger.error('Erro ao criar tabelas', { error: error.message });
    throw error;
  }
};

export const closeDatabase = async () => {
  if (db) {
    await db.close();
    logger.info('Conexão com banco de dados fechada');
    db = null;
  }
};
