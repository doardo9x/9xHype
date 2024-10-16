const axios = require('axios');

axios.post('http://localhost:3000/produtos', {
  nome: 'Produto 1',
  descricao: 'Descrição do Produto 1',
  preco: 99.99,
  estoque: 10
}, {
  headers: {
    'username': 'admin',
    'password': '#@ninexADM'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
