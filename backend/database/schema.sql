-- Criação da tabela de pedidos da Açaizada
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para guardar os itens e complementos de cada pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    produto VARCHAR(50) NOT NULL,
    base VARCHAR(50) NOT NULL,
    complementos TEXT, -- Lista de complementos separados por vírgula
    valor DECIMAL(10, 2) NOT NULL
);