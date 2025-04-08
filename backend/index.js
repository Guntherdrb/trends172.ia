const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { config } = require('dotenv');
const { OpenAI } = require('openai');

config(); // Cargar variables de entorno

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Configuración de Multer (aunque no se guarda la imagen)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🟢 Servidor Trends172.IA activo y escuchando 👌');
});

// Ruta principal para asesoramiento
app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
  const descripcion = req.body.descripcion;

  try {
    console.log(`🎨 Generando imagen para: ${descripcion}`);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: descripcion,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    // 🔍 Mostrar TODA la respuesta en consola para depuración
    console.log('📥 Respuesta completa de OpenAI:');
    console.dir(response, { depth: null });

    const base64 = response.data?.[0]?.b64_json;

    if (!base64) {
      console.error('⚠️ No se recibió base64 de OpenAI.');
      return res.status(500).json({ mensaje: 'No se generó la imagen.' });
    }

    console.log('✅ Imagen generada correctamente.');
    console.log('📦 Fragmento del base64:', base64.substring(0, 100) + '...');

    const imageData = `data:image/png;base64,${base64}`;

    res.json({
      recomendacion: 'Aquí se generará una recomendación futura.',
      imagen: imageData,
    });

  } catch (error) {
    console.error('❌ Error generando imagen:', error.message);
    res.status(500).json({ mensaje: 'Error generando imagen o recomendación.' });
  }
});

app.listen(port, () => {
  console.log(`🟢 Servidor Trends172.IA activo en http://localhost:${port}`);
  console.log(`🔐 API Key cargada: ✅ ${!!process.env.OPENAI_API_KEY ? 'CARGADA' : 'NO CARGADA'}`);
});
