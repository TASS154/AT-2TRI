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

function buscarPlanta(nome_c) {
    return plantas.filter(planta => planta.nome_c.toLowerCase() === nome_c.toLowerCase());
};

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

app.get('/alterar-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'alterar.html'))
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

    res.send(`
    <script>
        if (confirm('deseja retornar para a página principal?')) {
            window.location.href = '/';
        } else {
            window.location.href = '/alterar-planta';
        }
    </script>
    `);



})

app.get('/excluir-planta', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluir.html'))
})

app.post('/excluir-planta', (req, res) => {
    const nome_c = req.body.nome_c;


    const Index = plantas.findIndex(plantas => plantas.nome_c.toLowerCase() === nome_c.toLowerCase());

    if (Index === -1) {
        res.send(`<script>alert("Planta não econtrada!"); window.location.href = "/alterar-planta";</script>`)
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
        res.send(`<script>alert("Planta não econtrada!"); window.location.href = "/alterar-planta";</script>`)
    }

    plantas.splice(Index, 1);
    salvar();

    res.send(`<h1> A planta ${nome_c} foi excluido com sucesso! </h1>`)
    res.redirect('/')
});

app.get('/', (req, res) => {
    let cards = '';
    plantas.forEach(planta => {
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
    })
    const htmlContent = fs.readFileSync('index.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{cards}}', cards);

    res.send(finalHtml);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
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
    } else {
        res.send(`<script>alert("Planta não encontrada"); window.location.href = "/"</script>`);
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
