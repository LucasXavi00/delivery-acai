// ========================================
// CONTROLLER DE PEDIDOS
// ========================================

import logger from '../config/logger.js';
import { getDatabase } from '../config/database.js';
import { HTTP_STATUS, ORDER_STATUS } from '../constants.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const criarPedido = async (req, res, next) => {
  try {
    const { cliente, endereco, itens, total, pagamento } = req.body;

    if (!cliente || !itens || !total) {
      throw new ValidationError('Dados incompletos do pedido.', {
        requeridos: ['cliente', 'itens', 'total']
      });
    }

    const db = getDatabase();
    const itensString = Array.isArray(itens) ? JSON.stringify(itens) : itens;

    const result = await db.run(
      `INSERT INTO pedidos (cliente, endereco, itens, total, pagamento)
       VALUES (?, ?, ?, ?, ?)`,
      [cliente, endereco, itensString, total, pagamento]
    );

    logger.info('Novo pedido criado', {
      pedidoId: result.lastID,
      cliente,
      total
    });

    res.status(HTTP_STATUS.CREATED).json({
      sucesso: true,
      id: result.lastID,
      mensagem: 'Pedido criado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

export const listarPedidos = async (req, res, next) => {
  try {
    const db = getDatabase();

    const pedidos = await db.all('SELECT * FROM pedidos ORDER BY criado_em DESC LIMIT 100');

    logger.debug('Pedidos listados', { quantidade: pedidos.length });

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      dados: pedidos,
      total: pedidos.length
    });
  } catch (error) {
    next(error);
  }
};

export const obterPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const pedido = await db.get('SELECT * FROM pedidos WHERE id = ?', [id]);

    if (!pedido) {
      throw new NotFoundError(`Pedido #${id} não encontrado.`);
    }

    // Processa itens se armazenados como JSON
    if (typeof pedido.itens === 'string') {
      try {
        pedido.itens = JSON.parse(pedido.itens);
      } catch {
        // Se falhar, manter como string
      }
    }

    logger.debug('Pedido obtido', { pedidoId: id });

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      dados: pedido
    });
  } catch (error) {
    next(error);
  }
};

export const atualizarStatusPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new ValidationError('Status inválido.', {
        statusesValidos: Object.values(ORDER_STATUS)
      });
    }

    const db = getDatabase();

    // Verificar se pedido existe
    const pedido = await db.get('SELECT * FROM pedidos WHERE id = ?', [id]);

    if (!pedido) {
      throw new NotFoundError(`Pedido #${id} não encontrado.`);
    }

    // Atualizar status
    await db.run('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);

    logger.info('Status do pedido atualizado', {
      pedidoId: id,
      novoStatus: status
    });

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      mensagem: 'Status do pedido atualizado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

export const deletarPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Verificar se pedido existe
    const pedido = await db.get('SELECT * FROM pedidos WHERE id = ?', [id]);

    if (!pedido) {
      throw new NotFoundError(`Pedido #${id} não encontrado.`);
    }

    await db.run('DELETE FROM pedidos WHERE id = ?', [id]);

    logger.info('Pedido deletado', { pedidoId: id });

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      mensagem: 'Pedido deletado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

export const resetarPedidos = async (req, res, next) => {
  try {
    const db = getDatabase();

    await db.run('DELETE FROM pedidos');
    await db.run('DELETE FROM sqlite_sequence WHERE name = "pedidos"');

    logger.warn('Todos os pedidos foram resetados', {
      usuario: req.user?.role || 'admin'
    });

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      mensagem: 'Todos os pedidos foram resetados com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};
