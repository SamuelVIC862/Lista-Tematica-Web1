let btn = document.querySelector('.fa-eye')

btn.addEventListener('click', ()=>{
  let inputSenha = document.querySelector('#senha')
  
  if(inputSenha.getAttribute('type') == 'password'){
    inputSenha.setAttribute('type', 'text')
  } else {
    inputSenha.setAttribute('type', 'password')
  }
})

function entrar(){
  let usuario = document.querySelector('#usuario')
  let userLabel = document.querySelector('#userLabel')
  
  let senha = document.querySelector('#senha')
  let senhaLabel = document.querySelector('#senhaLabel')
  
  let msgError = document.querySelector('#msgError')
  
  let userValid = {
    nome: '',
    user: '',
    senha: '',
    coins: 0,
    gens: 0,
    lvl: 0,
    exp: 0
  }
  // =========================

  fetch(`http://localhost:3000/usuario/${usuario.value}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    userValid = data

    if(usuario.value == userValid.user && senha.value == userValid.senha){
      window.location.href = '../../index.html'
      
      let mathRandom = Math.random().toString(16)
      let token = mathRandom + mathRandom
      
      localStorage.setItem('token', token)
      localStorage.setItem('userLogado', JSON.stringify(userValid))
    } else {
      userLabel.setAttribute('style', 'color: red')
      usuario.setAttribute('style', 'border-color: red')
      senhaLabel.setAttribute('style', 'color: red')
      senha.setAttribute('style', 'border-color: red')
      msgError.setAttribute('style', 'display: block')
      msgError.innerHTML = 'Usuário ou senha incorretos'
      usuario.focus()
    }
    // Faça algo com os dados do usuário, como exibí-los na tela
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
    // Lide com o erro de acordo com seus requisitos
  });

  // =========================
  
  
}


