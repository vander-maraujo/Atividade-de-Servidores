//Importa o modulo nativo http do node.js
const http = require('http');
 
//Criamos um array/vetor para simular o banco de dados (persistência de memória.)
let livros = [
    {
        id: 1,
        titulo: 'O pequeno Principe',
        autor: 'Antoine ded Saint-Exipéry'
    }
];
 
const server = http.createServer((req, res) => {
    // Capturamos o metodo (GET, POST, PUT, DELETE, ETC)
    const metodo = req.method;
    // Captura a URL da requisição (rotas)
    const url = req.url;
    //Define que a resposta será em JSON
    res.setHeader('Content-type', 'application/json');
 
    // GET -> LISTAR LIVROS
 
    if (url === '/livros' && metodo === 'GET'){
        res.statusCode = 200; //status 200 = OK
        // Retornamos a lista de livros em formato json
        res.end(JSON.stringify(livros));
        // encerra a execução da requisição
        return;
    }
 
    // POST -> CRIAR LIVRO
    if(url === '/livros' && metodo === 'POST'){
        let body = ''; // vento disparado quando chegam os ' pedaços' da requisição
        req.on('data', parte => {
            body += parte // concatena os pedaços
        });
        req.on('end', () => {
            const novoLivro = JSON.parse(body); //adiciona o novo livro ao array livros
            livros.push(novoLivro);
            res.statusCode = 201; // status 201 = criado com sucesso
            res.end(JSON.stringify({
                mensagem: 'livro cadastrado com sucesso!',
                livro: novoLivro
            }))
        }) // stringify muda para JSON, e parse muda pra JS
        return; // encerra a requisição
    }
 
    // PUT -> ATUALIZAR LIVRO
    if (url === '/livros' && metodo === 'PUT'){
        let body = '';
        req.on('data', parte => {
            body += parte;
        });
        req.on('end', () => {
            // Dados atualizados vindo do usuario
            const livroAtualizado = JSON.parse(body);
            // Percorre a lista de livros e substitui o livro que tem o mesmo id
            livros = livros.map(livro => {
                // se==Se encontrar o mesmo ID, substitui
                if(livro.id === livroAtualizado.id){
                    return livroAtualizado;
                }
                // caso contrario, mantenho todos os livros originais
                return livro;
            });
            res.statusCode = 200;
            res.end(JSON.stringify({
                mensagem: 'Livro atualzado com sucesso!',
                livros:livros
            }));
        });
        return;
    }
 
    // DELETE -> REMOVER LIVRO
    if(url === '/livros' && metodo === 'DELETE'){
        let body = '';
        req.on('data', parte => {
            body+=parte;
        });
        req.on('end', () => {
            // Recebe o id do livro a ser excluido
            const dados = JSON.parse(body);
            // filtra o array removendo o livro com ID igual ao informado
            livros = livros.filter(livro => livro.id !== dados.id);
            res.statusCode = 200;
            res.end(JSON.stringify({
                mensagem: 'livro removido com sucesso!',
                livros:livros
            }))
        })
        return;
    }
// ROTA MÃO ENCONTRADA
    res.statusCode = 404;
    res.end(JSON.stringify({
        mensgaem: 'Rota não encontrada.'
    }))
    });
 
    server.listen(3000, () => {
        console.log('http://localhost:3000')
    })
 