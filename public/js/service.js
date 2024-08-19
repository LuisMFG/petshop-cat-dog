document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user-pets')
        .then(response => {
            if (!response.ok) {
                throw new Error('!');
            }
            return response.json();
        })
        .then(pets => {
            const select = document.getElementById('petId');
            pets.forEach(pet => {
                const option = document.createElement('option');
                option.value = pet.id;
                option.textContent = pet.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar animais:', error));
});

document.getElementById('serviceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const petId = document.getElementById('petId').value;
    const serviceType = document.getElementById('serviceType').value;
    const taxiPet = document.getElementById('taxiPet').value;
    const data = document.getElementById('serviceDate').value;
    const horario = document.getElementById('serviceTime').value;
    const pelagem = document.getElementById('pelagemType').value;

    fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId, serviceType, taxiPet, data, horario, pelagem })
    })
    .then(response => response.json())
    .then(data => {
        alert('Serviço cadastrado com sucesso!');
        document.getElementById('serviceForm').reset();
        window.location.href = 'userOptions.html';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
