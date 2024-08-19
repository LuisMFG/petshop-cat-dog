document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Valores de usuario e senha
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Faz uma requisição POST para a API de login
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })  
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {  
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';  
                } else if (data.role === 'user') {
                    window.location.href = 'userOptions.html';  
                }
            } else {
                alert('Usuário ou senha incorretos.');  
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');  
        });
});
