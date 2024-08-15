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

function buscarPlanta(nome_c) {
    return plantas.filter(planta => planta.nome_c.toLowerCase() === nome_c.toLowerCase());
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/buscar-planta', (req, res) => {
    const plantaBuscada = req.query.busca;
    const plantasEncontradas = buscarPlanta(plantaBuscada);

    if (plantasEncontradas.length > 0) {
        let cards = '';
        plantasEncontradas.forEach(planta => {
            cards += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${planta.fotos}" class="card-img-top" alt="${planta.nome_c}">
                    <div class="card-body">
                        <h5 class="card-title">${planta.nome_c}</h5>
                        <p class="card-text"><strong>Nome Científico:</strong> ${planta.nome_p}</p>
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
    } else {
        res.send(`<script>alert("Planta não encontrada"); window.location.href = "/"</script>`);
    }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
