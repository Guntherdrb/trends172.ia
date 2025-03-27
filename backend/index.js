const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const upload = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
    const descripcion = req.body.descripcion;

    const respuestaSimulada = {
        productos: [
            { nombre: "Encimera de cuarzo", precio: 120, descripcion: "Ideal para cocinas modernas." },
            { nombre: "Piso vinílico gris", precio: 25, descripcion: "Antideslizante y resistente al agua." }
        ],
        total: 145
    };

    res.json(respuestaSimulada);
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
