import { openDb } from "../configDB.js";

export async function ShopTable() {
    openDb().then(db => {
        db.exec(`
    CREATE TABLE IF NOT EXISTS Shop (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      descricao TEXT,
      moedas INTEGER,
      gemas INTEGER,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
    )
  `)
    .then(() => {
        console.log('Tabela Shop criada com sucesso');
    })
    .catch(error => {
        console.error('Erro ao criar tabela Usuario:', error);
    })
    .finally(() => {
        db.close();
    });
    });
}

export async function addShop(newbuy) {
    let db;

    try {
        db = await openDb();

        // Executar a inserção com os parâmetros diretamente
        const result = await db.run(
            'INSERT INTO Shop (nome, descricao, moedas, gemas, usuario_id) VALUES (?, ?, ?, ?, ?)',
            newbuy.nome,
            newbuy.descricao,
            newbuy.moedas,
            newbuy.gemas,
            newbuy.usuario_id,
        );

        console.log('Produto criado com sucesso:', newbuy.nome, 'ID:', result.lastID);
    } catch (error) {
        console.error('Erro ao criar Produto:', error);
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function excluirCompra(ShopId) {
    const db = await openDb();
  
    try {
      const resultado = await db.run('DELETE FROM Shop WHERE id = ?', ShopId);
      return resultado.changes > 0; // Verifica se alguma linha foi excluída
    } catch (error) {
      console.error('Erro ao excluir Compra:', error);
      throw error;
    } finally {
      await db.close();
    }
}

export async function obterShopDoUsuario(usuarioId) {
    const db = await openDb();
  
    try {
      const ShopDoUsuario = await db.all('SELECT * FROM Shop WHERE usuario_id = ?', usuarioId);
      return ShopDoUsuario;
    } catch (error) {
      console.error('Erro ao obter Loja do usuário:', error);
      throw error;
    } finally {
      await db.close();
    }
}

export async function obterCompraPorId(id) {
    let db;
    try {
        db = await openDb();

        const task = await db.get('SELECT * FROM Shop WHERE id = ?', id);

        return task;
    } catch (error) {
        console.error('Erro ao obter compra por id:', error);
        throw error;
    } finally {
        if (db) {
            await db.close();
        }
    }
}