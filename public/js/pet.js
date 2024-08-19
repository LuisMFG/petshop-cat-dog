document.getElementById('petForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('petName').value;
    const type = document.getElementById('petType').value;
    const sexo = document.getElementById('petSexo').value;
    const raca = document.getElementById('petRaca').value;
    const idade = document.getElementById('petIdade').value;
    const alergia = document.getElementById('petAlergia').value;

    fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, sexo, raca, idade, alergia })
    })
    .then(response => response.json())
    .then(data => {
        alert('Pet cadastrado com sucesso!');
        document.getElementById('petForm').reset();
        window.location.href = 'userOptions.html';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
