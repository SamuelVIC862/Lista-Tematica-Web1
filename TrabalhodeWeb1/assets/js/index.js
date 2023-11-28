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

function sair() {
  localStorage.removeItem("token");
  localStorage.removeItem("userLogado");
  window.location.href = "./assets/html/signin.html";
}
function showForm() {
  if (view_Form) {
    view_Form = false
  }else{
    view_Form = true
  }
}
function Mudarestado(el) {
  var display = document.getElementById(el).style.display;
  if(display == "flex")
      document.getElementById(el).style.display = 'none';
  else
      document.getElementById(el).style.display = 'flex';
}

function cadastrartask() {
  if (document.querySelector('#objnome').value == "" || document.querySelector('#objdesc').value == "" || document.querySelector('#objmoeda').value == "" || document.querySelector('#objgema').value == "") {
    alert("Todos os campos da Missão devem ser preenchidos!!")
  }else{
    const obj = {
      nome: document.querySelector('#objnome').value,
      descricao: document.querySelector('#objdesc').value,
      moedas: document.querySelector('#objmoeda').value,
      gemas: document.querySelector('#objgema').value,
      exp: 25,
      id: id
    }
    document.querySelector('#objnome').value = ""
    document.querySelector('#objdesc').value = ""
    document.querySelector('#objmoeda').value = ""
    document.querySelector('#objgema').value = ""
    Mudarestado('container')
    userLogado.tasks.push(obj)
    listartasks(obj, id);
    id++;
  }
}
function uping(exp) {
  userLogado.exp = userLogado.exp+exp
  if (userLogado.exp >= 100) {
    userLogado.exp = userLogado.exp -100
    userLogado.lvl++
    level.innerHTML = userLogado.lvl
  }
  const progresso = document.querySelector('#barralvlprogress')
  progresso.style.width = userLogado.exp+"%"
}

function delete_task(id){
  userLogado.tasks.forEach(task => {
    let inj = task
    if (id == task.id) {
      userLogado.tasks.splice(userLogado.tasks.findIndex(i => i.id === inj.id),1)
      let lista = document.querySelector('#listatasks')
      let task = document.querySelector('#task'+id)
      lista.removeChild(task)
    }
  });
}
function complete_task(id) {
  userLogado.tasks.forEach(task => {
    let inj = task
    if (id == task.id) {
      userLogado.tasks.splice(userLogado.tasks.findIndex(i => i.id === inj.id),1)
      let lista = document.querySelector('#listatasks')
      let task = document.querySelector('#task'+id)
      userLogado.coins = parseInt(userLogado.coins)+parseInt(inj.moedas)
      userLogado.gens = parseInt(userLogado.gens)+parseInt(inj.gemas)
      moedas.innerHTML = userLogado.coins
      gemas.innerHTML = userLogado.gens
      lista.removeChild(task)
      uping(inj.exp)
    }
  });
}

function listartasks(obj, id) {
  let lista = document.querySelector('#listatasks').innerHTML 
  /*                            Inicio                        Nome            Descrição                                                           Container Recompensa                   Container Moedas                                                                                                                                 Container Gemas                                                                                                                                                 Botão Completar                                                                                       Botão deletar                                                */
  lista = lista + "<div id=\"task"+id+"\" class=\"task\">"+"<p class=\"task_nome\">"+obj.nome+"</p>"+"<p class=\"task_desc\">"+obj.descricao+"</p>"+"<div class=\"recompensa\">"+"<div class=\"moedas\">"+"<img src=\"assets/images/money.png\" width=\"30\" height=\"30\">"+"<p class=\"task_moedas\">"+obj.moedas+"</p>"+"</div>"+"<div class=\"gemas\">"+"<img src=\"assets/images/gemstone.png\" width=\"25\" height=\"25\">"+"<p class=\"task_gemas\">"+obj.gemas+"</p> </div> </div>"+"<div class=\"container_btns\">"+"<button id=\"complete_btn\" class=\"btn_tasks\" onclick=\"complete_task("+id+ ")\">Completar</button>"+"<button id=\"delete_btn\" class=\"btn_tasks\" onclick=\"delete_task("+id+")\">Desistir</button>"+"</div>"+"</div>";
  document.querySelector('#listatasks').innerHTML = lista;
}