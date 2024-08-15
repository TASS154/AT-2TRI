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

app.get('/alterar-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'alterarPlanta.html'))
})

app.post('/alterar-planta', (req, res) => {
    const { nome_c, alt_nome_p, alt_caracteristicas, alt_propriedades, alt_fotos } = req.body

    const Index = plantas.findIndex(plantas => plantas.nome_c.toLowerCase() === nome_c.toLowerCase());

    if (Index === -1) {
        res.send(`<script>alert("Planta não econtrada!"); window.location.href = "/alterar-planta";</script>`)
        return
    }

    console.log(req.body)
    console.log(alt_nome_p)
    console.log(alt_caracteristicas)
    console.log(alt_propriedades)
    console.log(alt_fotos)
    console.log(nome_c)

    plantas[Index].fotos = alt_fotos
    plantas[Index].nome_p = alt_nome_p
    plantas[Index].caracteristicas = alt_caracteristicas
    plantas[Index].propriedade = alt_propriedades

    salvar()

    res.send('<script>alert("Planta alterada com sucesso!"); window.location.href = "/";</script>')



})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});