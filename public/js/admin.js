document.addEventListener('DOMContentLoaded', () => {
    const table = new DataTable('#adminTable', {
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
        },
        ajax: {
            url: '/api/admin/data',
            dataSrc: ''
        },
        columns: [
            { data: 'username' },
            { data: 'pet' },
            { data: 'type' },
            { data: 'pelagem' },
            { data: 'alergia' },
            { data: 'serviceType' },
            { data: 'status' },
            { data: 'telefone' },
            { data: 'horario' },
            { data: 'data' },
            {
                data: 'serviceId',
                render: (data, type, row) => {
                    return `
                        <button class="btn btn-success btn-sm finalizar-servico" data-id="${data}">Finalizar Serviço</button>
                        <button class="btn btn-primary btn-sm editar-servico" data-id="${data}">Editar</button>
                        <button class="btn btn-danger btn-sm excluir-servico" data-id="${data}">Excluir</button>
                        <button class="btn btn-info btn-sm contact-whatsapp" data-phone="${row.telefone}">WhatsApp</button>
                    `;
                }
            }
        ]
    });

    // Finaliza o serviço (botão)
    document.querySelector('#adminTable').addEventListener('click', (event) => {
        if (event.target.classList.contains('finalizar-servico')) {
            const serviceId = event.target.getAttribute('data-id');
            fetch(`/api/services/${serviceId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Finalizado' })
            })
            .then(response => response.json())
            .then(() => {
                table.ajax.reload();
                alert('Serviço finalizado com sucesso.');
            })
            .catch(() => alert('Erro ao finalizar o serviço.'));
        }
    });

    // Edita o serviço
    document.querySelector('#adminTable').addEventListener('click', (event) => {
        if (event.target.classList.contains('editar-servico')) {
            const serviceId = event.target.getAttribute('data-id');
            
            fetch(`/api/services/${serviceId}`)
                .then(response => response.json())
                .then(service => {
                    document.getElementById('editPetId').value = service.petId;
                    document.getElementById('editServiceType').value = service.serviceType;
                    document.getElementById('editTaxiPet').checked = service.taxiPet;
                    document.getElementById('editData').value = service.data;
                    document.getElementById('editHorario').value = service.horario;

                    
                    if (typeof bootstrap !== 'undefined') {
                        const editModal = new bootstrap.Modal(document.getElementById('editServiceModal'));
                        editModal.show();
                        
                        document.getElementById('editServiceId').value = serviceId;
                    } else {
                        alert('Bootstrap não está carregado corretamente.');
                    }
                })
                .catch(() => alert('Erro ao carregar os dados do serviço.'));
        }
    });

    // Salva a edição
    document.getElementById('saveEditButton').addEventListener('click', () => {
        const serviceId = document.getElementById('editServiceId').value;
        const petId = document.getElementById('editPetId').value;
        const serviceType = document.getElementById('editServiceType').value;
        const taxiPet = document.getElementById('editTaxiPet').checked;
        const data = document.getElementById('editData').value;
        const horario = document.getElementById('editHorario').value;

        fetch(`/api/services/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ petId, serviceType, taxiPet, data, horario})
        })
        .then(response => response.json())
        .then(() => {
            if (typeof bootstrap !== 'undefined') {
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
                editModal.hide();
            }
            table.ajax.reload();
            alert('Serviço atualizado com sucesso.');
        })
        .catch(() => alert('Erro ao atualizar o serviço.'));
    });

    // Exclui
    document.querySelector('#adminTable').addEventListener('click', (event) => {
        if (event.target.classList.contains('excluir-servico')) {
            const serviceId = event.target.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este serviço?')) {
                fetch(`/api/services/${serviceId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(() => {
                    table.ajax.reload();
                    alert('Serviço excluído com sucesso.');
                })
                .catch(() => alert('Erro ao excluir o serviço.'));
            }
        }
    });

    // Url do zap com mensagem personalizada
    document.querySelector('#adminTable').addEventListener('click', (event) => {
        if (event.target.classList.contains('contact-whatsapp')) {
            const phone = event.target.getAttribute('data-phone');
            const message = `Olá! 🐱🐶\n\nSeu serviço foi concluído com sucesso no Cat&Dog! 🐾 Se você solicitou o Táxi Pet, ele estará chegando em breve no seu endereço. 🚖 Caso contrário, por favor, venha buscar seu pet na nossa loja.\n\nLembre-se, nosso horário de funcionamento é até às 17h.\n\nAgradecemos a sua preferência e estamos à disposição para qualquer necessidade!\n\nAtenciosamente,\nEquipe Cat&Dog`;
            const whatsappUrl = `https://web.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    });
});
