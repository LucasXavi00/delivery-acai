const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function conectarBanco() {
    const db = await open({
        filename: path.join(__dirname, 'açaizada.db'),
        driver: sqlite3.Database
    });

    // Criação das tabelas
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
            pedido_id INTEGER,
            produto TEXT NOT NULL,
            base TEXT NOT NULL,
            complementos TEXT,
            valor REAL NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
        );
    `);

    return db;
}

module.exports = conectarBanco;