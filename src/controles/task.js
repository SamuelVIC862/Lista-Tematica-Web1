import { openDb } from "../configDB.js";

export async function TaskTable() {
    openDb().then(db => {
        db.exec(`
    CREATE TABLE IF NOT EXISTS Task (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      descricao TEXT,
      moedas INTEGER,
      gemas INTEGER,
      exp INTEGER,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
    )
  `)
    .then(() => {
        console.log('Tabela Task criada com sucesso');
    })
    .catch(error => {
        console.error('Erro ao criar tabela Usuario:', error);
    })
    .finally(() => {
        db.close();
    });
    });
}

export async function addTask(novaTask) {
    let db;

    try {
        db = await openDb();

        // Executar a inserção com os parâmetros diretamente
        const result = await db.run(
            'INSERT INTO Task (nome, descricao, moedas, gemas, exp, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
            novaTask.nome,
            novaTask.descricao,
            novaTask.moedas,
            novaTask.gemas,
            novaTask.exp,
            novaTask.usuario_id,
        );

        console.log('Task criada com sucesso:', novaTask.nome, 'ID:', result.lastID);
    } catch (error) {
        console.error('Erro ao criar Task:', error);
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function excluirTarefa(taskId) {
    const db = await openDb();
  
    try {
      const resultado = await db.run('DELETE FROM Task WHERE id = ?', taskId);
      return resultado.changes > 0; // Verifica se alguma linha foi excluída
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    } finally {
      await db.close();
    }
}

export async function obterTasksDoUsuario(usuarioId) {
    const db = await openDb();
  
    try {
      const tasksDoUsuario = await db.all('SELECT * FROM Task WHERE usuario_id = ?', usuarioId);
      return tasksDoUsuario;
    } catch (error) {
      console.error('Erro ao obter tarefas do usuário:', error);
      throw error;
    } finally {
      await db.close();
    }
}

export async function obterTaskPorId(id) {
    let db;
    try {
        db = await openDb();

        const task = await db.get('SELECT * FROM Task WHERE id = ?', id);

        return task;
    } catch (error) {
        console.error('Erro ao obter task por id:', error);
        throw error;
    } finally {
        if (db) {
            await db.close();
        }
    }
}