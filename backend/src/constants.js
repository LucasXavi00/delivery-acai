// ========================================
// CONSTANTES DA APLICAÇÃO
// ========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  TOKEN_NOT_PROVIDED: 'Acesso negado. Token não fornecido.',
  INVALID_TOKEN: 'Token inválido ou expirado.',
  MISSING_FIELDS: 'Dados incompletos. Verifique os campos obrigatórios.',
  INTERNAL_ERROR: 'Erro interno no servidor.',
  DATABASE_ERROR: 'Erro ao conectar ao banco de dados.',
  ORDER_NOT_FOUND: 'Pedido não encontrado.',
  FORBIDDEN_ACCESS: 'Acesso negado. Permissão insuficiente.'
};

export const ORDER_STATUS = {
  PENDING: 'pendente',
  CONFIRMED: 'confirmado',
  PREPARING: 'preparando',
  READY: 'pronto',
  DISPATCHED: 'despachado',
  DELIVERED: 'entregue',
  CANCELED: 'cancelado'
};

export const PAYMENT_METHODS = {
  CASH: 'dinheiro',
  CREDIT_CARD: 'cartao_credito',
  DEBIT_CARD: 'cartao_debito',
  PIX: 'pix'
};

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};
