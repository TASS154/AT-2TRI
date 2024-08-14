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

app.get('/', (req, res) => {
    let cards = '';
    plantas.forEach(planta => {
        cards += `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${planta.fotos}" class="card-img-top" alt="${planta.nome_c}">
                <div class="card-body">
                    <h5 class="card-title">${planta.nome_c}</h5>
                    <p class="card-text"><strong>Nome Popular:</strong> ${planta.nome_p}</p>
                    <p class="card-text"><strong>Características:</strong> ${planta.caracteristicas}</p>
                    <p class="card-text"><strong>Propriedade:</strong> ${planta.propriedade}</p>
                </div>
            </div>
        </div>
        `;
    });
const htmlContent = fs.readFileSync('index.html', 'utf-8');
const finalHtml = htmlContent.replace('{{cards}}', cards);

res.send(finalHtml);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})