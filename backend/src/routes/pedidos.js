// ========================================
// ROTAS DE PEDIDOS
// ========================================

import express from 'express';
import {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarStatusPedido,
  deletarPedido,
  resetarPedidos
} from '../controllers/pedidosController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { sanitizeInput, validateRequired } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/pedidos
 * Criar novo pedido (público)
 * Body: { cliente, endereco, itens, total, pagamento }
 * Response: { sucesso: true, id: number }
 */
router.post('/', sanitizeInput, validateRequired(['cliente', 'itens', 'total']), criarPedido);

/**
 * GET /api/pedidos
 * Listar pedidos (requer autenticação)
 * Response: { sucesso: true, dados: array, total: number }
 */
router.get('/', authMiddleware, adminMiddleware, listarPedidos);

/**
 * DELETE /api/pedidos/reset
 * Resetar todos os pedidos (admin only)
 * Response: { sucesso: true, mensagem: string }
 */
router.delete('/reset', authMiddleware, adminMiddleware, resetarPedidos);

/**
 * GET /api/pedidos/:id
 * Obter pedido específico (público)
 * Response: { sucesso: true, dados: object }
 */
router.get('/:id', obterPedido);

/**
 * PUT /api/pedidos/:id
 * Atualizar status do pedido (admin only)
 * Body: { status: string }
 * Response: { sucesso: true, mensagem: string }
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  sanitizeInput,
  validateRequired(['status']),
  atualizarStatusPedido
);

/**
 * DELETE /api/pedidos/:id
 * Deletar pedido (admin only)
 * Response: { sucesso: true, mensagem: string }
 */
router.delete('/:id', authMiddleware, adminMiddleware, deletarPedido);

export default router;
