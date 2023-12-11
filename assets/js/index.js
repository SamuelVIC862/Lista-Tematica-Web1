if (localStorage.getItem("token") == null) {
  window.location.href = "./assets/html/signin.html";
  alert("Você precisa estar logado para acessar essa página");
}

const userLogado = JSON.parse(localStorage.getItem("userLogado"));

const moedas = document.querySelector('#moedasvalor')
moedas.innerHTML = userLogado.coins

const gemas = document.querySelector('#gemasvalor')
gemas.innerHTML = userLogado.gens

const level = document.querySelector('#lvl')
level.innerHTML = userLogado.lvl

var id = 0
var view_Form = false
document.addEventListener('DOMContentLoaded', () => {
  ShowZone('container_lista')
  carregarTasks()
  carregarLoja()
  uping(0)
})

// ==================== Usuario =======================

function sair() {
  localStorage.removeItem("token");
  localStorage.removeItem("userLogado");
  window.location.href = "./assets/html/signin.html";
}

function uping(exp) {
  userLogado.exp = userLogado.exp + exp
  if (userLogado.exp >= 100) {
    userLogado.exp = userLogado.exp - 100
    userLogado.lvl++
    level.innerHTML = userLogado.lvl
    var audio = new Audio('./assets/sounds/LevelUp.mp3');
    audio.addEventListener('canplaythrough', function () {
      audio.play();
    });
    if (userLogado.lvl % 5 === 0 && userLogado.lvl > 1) {
      let recMoedas = 5 * (userLogado.lvl / 5)
      let recGemas = 1 * (userLogado.lvl / 5)
      alert("Parabéns você alcançou o nivel: " + userLogado.lvl +
        " Como recompensa pelo seu esforço você ira receber: Moedas: " + recMoedas + " Gemas: " + recGemas)
      userLogado.coins = parseInt(userLogado.coins) + parseInt(recMoedas);
      userLogado.gens = parseInt(userLogado.gens) + parseInt(recGemas);
      moedas.innerHTML = userLogado.coins;
      gemas.innerHTML = userLogado.gens;
      atualizarUsuario(userLogado)
    }
  }
  const progresso = document.querySelector('#barralvlprogress')
  progresso.style.width = userLogado.exp + "%"
}

function atualizarUsuario(usuario) {
  fetch(`http://localhost:3000/modificar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      console.log('Usuário atualizado no backend:', responseData);
    })
    .catch(error => {
      console.error('Erro na requisição PUT:', error);
    });
}

// ====================================================

// ================ List view Tasks ===================

function carregarTasks() {
  fetch(`http://localhost:3000/tasks/${userLogado.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data.tasks)) {
        data.tasks.forEach(task => {
          console.log('Task:', task);
          listartasks(task, task.id)
        });
      } else {
        console.error('Resposta inesperada: tasks não é um array', data);
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
      // Lide com o erro de acordo com seus requisitos
    });
}

function cadastrartask() {
  const objNome = document.querySelector('#objnome').value;
  const objDesc = document.querySelector('#objdesc').value;
  const objMoeda = document.querySelector('#objmoeda').value;
  const objGema = document.querySelector('#objgema').value;

  if (objNome === "" || objDesc === "" || objMoeda === "" || objGema === "") {
    alert("Todos os campos da Missão devem ser preenchidos!!");
  } else {
    const obj = {
      nome: objNome,
      descricao: objDesc,
      moedas: parseInt(objMoeda), // Convertendo para inteiro, ajuste conforme necessário
      gemas: parseInt(objGema),   // Convertendo para inteiro, ajuste conforme necessário
      exp: 25,
      usuario_id: userLogado.id
    };

    fetch('http://localhost:3000/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json(); // Retorna os dados da tarefa cadastrada, se necessário
      })
      .then(data => {
        // Lide com a resposta do servidor conforme necessário
        console.log('Task cadastrada com sucesso:', data);
        document.querySelector('#objnome').value = "";
        document.querySelector('#objdesc').value = "";
        document.querySelector('#objmoeda').value = "";
        document.querySelector('#objgema').value = "";
        ShowZone('container');
        console.log(data.id)
        location.reload();
        listartasks(obj, data.id); // Use o ID retornado pelo servidor
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        // Lide com o erro de acordo com seus requisitos
      });
  }
}

function delete_task(id) {

  console.log(id)

  fetch(`http://localhost:3000/tasksdel/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      console.log('Task deletada com sucesso!');
      let lista = document.querySelector('#listatasks')
      let task = document.querySelector('#task' + id)
      lista.removeChild(task)
    })
    .catch(error => {
      console.error('Erro na requisição:', error);

    });
}

function complete_task(id) {
  fetch(`http://localhost:3000/task/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(taskDetails => {
      userLogado.coins = parseInt(userLogado.coins) + parseInt(taskDetails.moedas);
      userLogado.gens = parseInt(userLogado.gens) + parseInt(taskDetails.gemas);
      moedas.innerHTML = userLogado.coins;
      gemas.innerHTML = userLogado.gens;

      uping(taskDetails.exp);
      atualizarUsuario(userLogado)

      fetch(`http://localhost:3000/usuario/${userLogado.user}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados do usuário:', data);

          localStorage.setItem('userLogado', JSON.stringify(userLogado));

        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });

      delete_task(id);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function listartasks(obj, id) {
  let lista = document.querySelector('#listatasks').innerHTML
  /*                            Inicio                        Nome            Descrição                                                           Container Recompensa                   Container Moedas                                                                                                                                 Container Gemas                                                                                                                                                 Botão Completar                                                                                       Botão deletar                                                */
  lista = lista + "<div id=\"task" + id + "\" class=\"task\">" + "<p class=\"task_nome\">" + obj.nome + "</p>" + "<p class=\"task_desc\">" + obj.descricao + "</p>" + "<div class=\"recompensa\">" + "<div class=\"moedas\">" + "<img src=\"assets/images/money.png\" width=\"30\" height=\"30\">" + "<p class=\"task_moedas\">" + obj.moedas + "</p>" + "</div>" + "<div class=\"gemas\">" + "<img src=\"assets/images/gemstone.png\" width=\"25\" height=\"25\">" + "<p class=\"task_gemas\">" + obj.gemas + "</p> </div> </div>" + "<div class=\"container_btns\">" + "<button id=\"complete_btn\" class=\"btn_tasks\" onclick=\"complete_task(" + id + ")\">Completar</button>" + "<button id=\"delete_btn\" class=\"btn_tasks\" onclick=\"delete_task(" + id + ")\">Desistir</button>" + "</div>" + "</div>";
  document.querySelector('#listatasks').innerHTML = lista;
}

// ====================================================

// ============== Formulario Tasks ====================

function ShowZone(el) {
  var display = document.getElementById(el).style.display;
  if (display == "flex")
    document.getElementById(el).style.display = 'none';
  else
    document.getElementById(el).style.display = 'flex';
}

// ====================================================

function ShowZoneShop(el) {
  ShowZone('container_lista')
  var display = document.getElementById(el).style.display;
  if (display == "flex")
    document.getElementById(el).style.display = 'none';
  else
    document.getElementById(el).style.display = 'flex';
}

function carregarLoja() {
  fetch(`http://localhost:3000/loja/${userLogado.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data.loja)) {
        data.loja.forEach(produto => {
          console.log('Produto:', produto);
          listarprodutos(produto, produto.id)
        });
      } else {
        console.error('Resposta inesperada: tasks não é um array', data);
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
      // Lide com o erro de acordo com seus requisitos
    });
}

function listarprodutos(obj, id) {
  let lista = document.querySelector('#listashops').innerHTML
  /*                            Inicio                        Nome            Descrição                                                           Container Recompensa                   Container Moedas                                                                                                                                 Container Gemas                                                                                                                                                 Botão Completar                                                                                       Botão deletar                                                */
  lista = lista + "<div id=\"produto" + id + "\" class=\"task\">" + "<p class=\"task_nome\">" + obj.nome + "</p>" + "<p class=\"task_desc\">" + obj.descricao + "</p>" + "<div class=\"recompensa\">" + "<div class=\"moedas\">" + "<img src=\"assets/images/money.png\" width=\"30\" height=\"30\">" + "<p class=\"task_moedas\">" + obj.moedas + "</p>" + "</div>" + "<div class=\"gemas\">" + "<img src=\"assets/images/gemstone.png\" width=\"25\" height=\"25\">" + "<p class=\"task_gemas\">" + obj.gemas + "</p> </div> </div>" + "<div class=\"container_btns\">" + "<button id=\"complete_btn\" class=\"btn_tasks\" onclick=\"Comprar_produto(" + id + ")\">Completar</button>" + "<button id=\"delete_btn\" class=\"btn_tasks\" onclick=\"delete_Produto(" + id + ")\">Desistir</button>" + "</div>" + "</div>";
  document.querySelector('#listashops').innerHTML = lista;
}

function delete_Produto(id) {

  fetch(`http://localhost:3000/shopdel/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      console.log('Produto deletado com sucesso!');
      let lista = document.querySelector('#listashops')
      let produto = document.querySelector('#produto' + id)
      lista.removeChild(produto)
    })
    .catch(error => {
      console.error('Erro na requisição:', error);

    });
}

function Comprar_produto(id) {
  fetch(`http://localhost:3000/produto/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(produtoDetails => {
      if (userLogado.coins >= produtoDetails.moedas && userLogado.gens >= produtoDetails.gemas) {
        userLogado.coins = parseInt(userLogado.coins) - parseInt(produtoDetails.moedas);
        userLogado.gens = parseInt(userLogado.gens) - parseInt(produtoDetails.gemas);
        moedas.innerHTML = userLogado.coins;
        gemas.innerHTML = userLogado.gens;
        atualizarUsuario(userLogado)

        fetch(`http://localhost:3000/usuario/${userLogado.user}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Dados do usuário:', data);

            localStorage.setItem('userLogado', JSON.stringify(userLogado));

          })
          .catch(error => {
            console.error('Erro na requisição:', error);
          });
      } else {
        alert("Você não tem dinheiro suficiente!!")
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function cadastrarProduto() {
  const objNome = document.querySelector('#objnomeshop').value;
  const objDesc = document.querySelector('#objdescshop').value;
  const objMoeda = document.querySelector('#objmoedashop').value;
  const objGema = document.querySelector('#objgemashop').value;

  console.log(objDesc, objGema, objNome, objMoeda)

  if (objNome === "" || objDesc === "" || objMoeda === "" || objGema === "") {
    alert("Todos os campos do Produto devem ser preenchidos!!");
  } else {
    const obj = {
      nome: objNome,
      descricao: objDesc,
      moedas: parseInt(objMoeda),
      gemas: parseInt(objGema),
      usuario_id: userLogado.id
    };

    fetch('http://localhost:3000/shop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json(); // Retorna os dados da tarefa cadastrada, se necessário
      })
      .then(data => {
        // Lide com a resposta do servidor conforme necessário
        console.log('Produto cadastrada com sucesso:', data);
        document.querySelector('#objnome').value = "";
        document.querySelector('#objdesc').value = "";
        document.querySelector('#objmoeda').value = "";
        document.querySelector('#objgema').value = "";
        ShowZone('container_shop');
        console.log(data.id)
        location.reload();
        ShowZoneShop('container_lista_shop')
        listarprodutos(obj, data.id); // Use o ID retornado pelo servidor
        alert("Produto postado com sucesso!!")
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        // Lide com o erro de acordo com seus requisitos
      });
  }
}