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

app.get('/adicionar-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionar.html'));
});


app.post('/adicionar-planta', (req, res) => {
    const novoplanta = req.body;

    if (plantas.find(planta => planta.nome_c.toLowerCase() === novoplanta.nome_c.toLowerCase())) {
        res.send(`
        <script>alert("Planta já cadastrada!"); window.location.href = "/adicionar-planta";</script>
        `);
        return;
    }

    plantas.push(novoplanta);
    console.log(plantas);

    salvar();

    res.redirect('/');

});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})