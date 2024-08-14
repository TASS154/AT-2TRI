const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const plantasPath = path.join(__dirname, 'plantas.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let plantasData = fs.readFileSync(plantasPath, 'utf-8');
let plantas = JSON.parse(plantasData);

function salvar() {
    fs.writeFileSync(plantasPath, JSON.stringify(plantas, null, 2));
}

app.get('/excluir-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluir.html'))
})

app.post('/excluir-planta', (req, res) => {
    const  nome_c  = req.body.nome_c;


    const Index = plantas.findIndex(plantas => plantas.nome_c.toLowerCase() === nome_c.toLowerCase());

    if (Index === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
    }

    console.log("teste");
    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir a planta ${nome_c}?')) {
                window.location.href = '/excluir-confirmado-planta?nome_c=${nome_c}';
            } else {
                window.location.href = '/excluir-planta';
            }
        </script>
        `);
});

app.get('/excluir-confirmado-planta', (req, res) => {
    const nome_c = req.query.nome_c;

    const Index = plantas.findIndex(plantas => plantas.nome_c.toLowerCase() === nome_c.toLowerCase());
    if (Index === -1) {
        res.send('<h1>Planta não encontrado.</h1>');
    }

    plantas.splice(Index, 1);
    salvar();

    res.send(`<h1> A planta ${nome_c} foi excluido com sucesso! </h1>`)
    res.redirect('/')
});

app.listen(port, () =>{
    console.log(`http://localhost:${port}`)
})