const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const conectarBanco = require('../database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'sua_chave_secreta_açaizada_2026'; // Mude em produção

app.use(cors());
app.use(express.json());

let db;

conectarBanco().then(database => {
    db = database;
    console.log('🗄️  Banco de dados SQLite conectado com sucesso!');
}).catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

// Middleware para verificar se o usuário está autenticado
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido ou expirado.' });
        req.usuario = usuario;
        next();
    });
}

// ROTA DE LOGIN (Defina aqui a senha do admin)
app.post('/api/login', (req, res) => {
    const { senha } = req.body;
    const SENHA_MESTRE = 'acai123'; // Define a senha do painel da cozinha

    if (senha === SENHA_MESTRE) {
        // Gera o token válido por 12 horas
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '12h' });
        return res.json({ token });
    }

    return res.status(401).json({ erro: 'Senha incorreta!' });
});

// ROTA PÚBLICA: Criar novo pedido (Cliente)
app.post('/api/pedidos', async (req, res) => {
    try {
        const { cliente, endereco, pagamento, itens, total } = req.body;

        const resultado = await db.run(
            `INSERT INTO pedidos (cliente, endereco, pagamento, total, status) VALUES (?, ?, ?, ?, ?)`,
            [cliente, endereco, pagamento, total, 'pendente']
        );

        const pedidoId = resultado.lastID;

        for (const item of itens) {
            const complementosTexto = item.complementos.length > 0 ? item.complementos.join(', ') : 'Nenhum';
            await db.run(
                `INSERT INTO itens_pedido (pedido_id, produto, base, complementos, valor) VALUES (?, ?, ?, ?, ?)`,
                [pedidoId, item.produto, item.base, complementosTexto, item.valor]
            );
        }

        console.log(`📦 NOVO PEDIDO #${pedidoId} GRAVADO NO BANCO!`);
        return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso!', id: pedidoId });
    } catch (error) {
        console.error('Erro ao salvar pedido:', error);
        return res.status(500).json({ erro: 'Erro ao processar pedido' });
    }
});

// ROTAS PROTEGIDAS (Apenas com token válido)

// Listar todos os pedidos
app.get('/api/pedidos', autenticarToken, async (req, res) => {
    try {
        const pedidos = await db.all(`SELECT * FROM pedidos ORDER BY id DESC`);

        for (let pedido of pedidos) {
            const itens = await db.all(`SELECT * FROM itens_pedido WHERE pedido_id = ?`, [pedido.id]);
            pedido.itens = itens.map(item => ({
                produto: item.produto,
                base: item.base,
                complementos: item.complementos !== 'Nenhum' ? item.complementos.split(', ') : [],
                valor: item.valor
            }));
        }

        return res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({ erro: 'Erro ao carregar pedidos' });
    }
});

// Atualizar status do pedido
app.patch('/api/pedidos/:id/status', autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.run(`UPDATE pedidos SET status = ? WHERE id = ?`, [status, id]);
        console.log(`🔄 Status do Pedido #${id} alterado para: ${status}`);
        return res.json({ mensagem: 'Status atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar status do pedido' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});