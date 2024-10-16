// Lida com o formulário de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const token = await response.text();
        localStorage.setItem('token', token); // Salva o token no localStorage

        alert('Logado com sucesso');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login');
    }
});

// Lida com o formulário de adição de produto
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;
    const token = localStorage.getItem('token'); // Obtém o token do localStorage

    try {
        const response = await fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token // Envia o token no cabeçalho
            },
            body: JSON.stringify({ nome, descricao, preco, estoque })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto');
    }
});
