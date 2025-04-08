const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { config } = require('dotenv');
const { OpenAI } = require('openai');

config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta principal
app.get('/', (req, res) => {
  res.send('🟢 Servidor Trends172.IA activo y escuchando 👌');
});

// Ruta POST que genera la imagen
app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
  const descripcion = req.body.descripcion;

  console.log('📨 Descripción recibida:', descripcion);
  if (req.file) {
    console.log('🖼️ Imagen recibida:', req.file.originalname);
  }

  try {
    console.log('🎯 Llamando a OpenAI para generar imagen...');

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: descripcion,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    console.log('📥 Respuesta completa de OpenAI:', imageResponse);

    const base64 = imageResponse.data[0]?.b64_json;

    if (!base64) {
      console.error('❌ No se recibió imagen desde OpenAI.');
      return res.status(500).json({ mensaje: 'No se recibió imagen desde OpenAI.' });
    }

    const imageDataUrl = `data:image/png;base64,${base64}`;
    const recomendacion = 'No se pudo generar una recomendación.';

    console.log('✅ Imagen generada correctamente.');
    res.json({ recomendacion, imagen: imageDataUrl });

  } catch (error) {
    console.error('❌ Error generando la imagen:', error.message);
    res.status(500).json({ mensaje: 'Error generando la imagen o recomendación.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🟢 Servidor Trends172.IA activo en http://localhost:${port}`);
  console.log(`🔐 API Key cargada: ✅ ${!!process.env.OPENAI_API_KEY ? 'CARGADA' : 'NO CARGADA'}`);
});
