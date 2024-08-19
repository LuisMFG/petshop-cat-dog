// api do viacep
document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    alert('CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    }
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;  
    const telefone = document.getElementById('telefone').value;  
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    console.log('Dados do formulário:', { username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado });

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado })
    })
        .then(response => response.json())
        .then(data => {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('registerForm').reset();
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
