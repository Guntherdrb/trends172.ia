const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { config } = require('dotenv');
const { OpenAI } = require('openai');

config();

const app = express();
const port = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Trends172.IA activo y escuchando 👌');
});

// Ruta principal
app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
  const descripcion = req.body.descripcion;
  const archivoImagen = req.file?.originalname || 'no proporcionada';

  console.log('📝 Descripción recibida:', descripcion);
  console.log('🖼️ Imagen recibida:', archivoImagen);
  console.log('🎯 Llamando a OpenAI para generar imagen...');

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: descripcion,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const base64Image = response.data[0]?.b64_json;
    if (!base64Image) {
      console.log('❌ No se recibió imagen de OpenAI.');
      return res.status(500).json({ mensaje: 'No se recibió imagen de OpenAI.' });
    }

    const dataUrl = `data:image/png;base64,${base64Image}`;
    console.log('✅ Imagen generada correctamente.');

    res.json({
      recomendacion: 'No se pudo generar una recomendación automática.',
      imagen: dataUrl
    });

  } catch (error) {
    console.error('❌ Error al generar imagen:', error.message);
    res.status(500).json({ mensaje: 'Error al generar imagen o recomendación.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
  console.log(`==> Your service is live 🎉`);
});
