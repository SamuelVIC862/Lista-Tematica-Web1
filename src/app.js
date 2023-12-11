import { UserTable, atualizarUsuario, inserirUsuario, obterUsuarioPorLogin } from './controles/usuario.js';
import { TaskTable, addTask, obterTasksDoUsuario, excluirTarefa, obterTaskPorId } from './controles/task.js';
import { ShopTable, addShop, excluirCompra, obterCompraPorId, obterShopDoUsuario } from './controles/shop.js';

import path from 'path';
import cors from 'cors';
import express from 'express';

const app = express();
const publicPath = path.join(process.cwd());
app.use(express.static(publicPath));
const server = app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

app.use(express.json());
app.use(cors());

UserTable()
TaskTable()
ShopTable()

// Rota para o arquivo index.html
app.get('', function (req, res) {
    const indexPath = path.join(publicPath, '../index.html');
    res.sendFile(indexPath);
});

process.on('beforeExit', () => {
    console.log('Encerrando servidor...');

    // Encerre seu servidor Express
    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});

app.post("/cadastro", function (req, res) {
    console.log(req.params)
    inserirUsuario(req.body)
    res.json({
        "statusCode": 200
    })
})

app.put("/modificar", function (req, res) {
    if (req.body && !req.body.id) {
        res.json({
            "statusCode": "400",
            "msg": "Id do Usuario não informado!!"
        })
    } else {
        atualizarUsuario(req.body)
        res.json({
            "statusCode": 200
        })
    }
})

app.get('/usuario/:user', async (req, res) => {
    const login = req.params.user;
    const userinvalid = {
        nome: "",
        senha: ""
    }

    try {
        const usuario = await obterUsuarioPorLogin(login);

        if (usuario) {
            res.json(usuario);
        } else {
            res.json(userinvalid);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter usuário por login' });
    }
});


// Section Task routes

app.post("/task", function (req, res) {
    if (req.body && !req.body.usuario_id) {
        res.json({
            "statusCode": "400",
            "msg": "Id do Usuario não informado!!"
        })
    } else {
        addTask(req.body)
        res.json({
            "statusCode": 200
        })
    }
})

app.delete('/tasksdel/:taskId', async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const resultado = await excluirTarefa(taskId);

        if (resultado) {
            res.json({ message: 'Tarefa excluída com sucesso' });
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/tasks/:usuarioId', async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        const tasksDoUsuario = await obterTasksDoUsuario(usuarioId); // Corrigido para usuarioId

        // Responder com as tasks obtidas
        res.json({ tasks: tasksDoUsuario });
    } catch (error) {
        console.error('Erro ao obter tasks do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/task/:id', async (req, res) => {
    const id = req.params.id;

    console.log(req.params.id)
    try {
        const task = await obterTaskPorId(id);

        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter Task por id' });
    }
});

// ====================== Zone Shop ==========================

app.post("/shop", function (req, res) {
    if (req.body && !req.body.usuario_id) {
        res.json({
            "statusCode": "400",
            "msg": "Id do Usuario não informado!!"
        })
    } else {
        addShop(req.body)
        res.json({
            "statusCode": 200
        })
    }
})

app.delete('/shopdel/:shopId', async (req, res) => {
    const taskId = req.params.shopId;

    try {
        const resultado = await excluirCompra(taskId);

        if (resultado) {
            res.json({ message: 'Produto excluído com sucesso' });
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/loja/:usuarioId', async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        const lojaDoUsuario = await obterShopDoUsuario(usuarioId); // Corrigido para usuarioId

        // Responder com as tasks obtidas
        res.json({ loja: lojaDoUsuario });
    } catch (error) {
        console.error('Erro ao obter loja do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/produto/:id', async (req, res) => {
    const id = req.params.id;

    console.log(req.params.id)
    try {
        const produto = await obterCompraPorId(id);

        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter Produto por id' });
    }
});
