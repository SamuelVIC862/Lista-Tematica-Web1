import { openDb } from "../configDB.js";

export async function UserTable() {
    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY, nome TEXT, user TEXT, senha TEXT, coins INTEGER, gens INTEGER, exp INTEGER, lvl INTEGER)')
            .then(() => {
                console.log('Tabela Usuario criada com sucesso');
            })
            .catch(error => {
                console.error('Erro ao criar tabela Usuario:', error);
            })
            .finally(() => {
                db.close();
            });
    });
}


export async function inserirUsuario(novoUsuario) {
    let db;

    try {
        db = await openDb();

        // Executar a inserção com os parâmetros diretamente
        const result = await db.run(
            'INSERT INTO Usuario (nome, user, senha, coins, gens, exp, lvl) VALUES (?, ?, ?, ?, ?, ?, ?)',
            novoUsuario.nome,
            novoUsuario.user,
            novoUsuario.senha,
            novoUsuario.coins,
            novoUsuario.gens,
            novoUsuario.exp,
            novoUsuario.lvl
        );

        console.log('Usuário criado com sucesso:', novoUsuario.nome, 'ID:', result.lastID);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function atualizarUsuario(novosValores) {
    let db;

    try {
        const { id, ...dadosUsuario } = novosValores;

        db = await openDb();

        // Construir a instrução SQL para atualizar todas as colunas
        const sql = 'UPDATE Usuario SET nome = ?, user = ?, senha = ?, coins = ?, gens = ?, exp = ?, lvl = ? WHERE id = ?';

        // Obter os valores a serem atualizados
        const valoresAtualizar = Object.values(dadosUsuario);
        valoresAtualizar.push(id); // Adicionar o ID do usuário ao final do array

        // Executar a atualização
        const result = await db.run(sql, ...valoresAtualizar);

        console.log('Usuário com ID', id, 'atualizado com sucesso:', result);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function obterUsuarioPorLogin(user) {
    let db;

    try {
        db = await openDb();

        // Verifique se o nome da tabela e coluna estão corretos
        const usuario = await db.get('SELECT * FROM Usuario WHERE user = ?', user);

        return usuario;
    } catch (error) {
        console.error('Erro ao obter usuário por login:', error);
        throw error; // Rejeita a promessa com o erro
    } finally {
        if (db) {
            await db.close();
        }
    }
}