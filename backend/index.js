const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { config } = require('dotenv');
const { OpenAI } = require('openai');

config(); // Cargar .env

const app = express();
const port = process.env.PORT || 3000;

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Configuración de multer para recibir imagen (aunque no se usa directamente)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🟢 Servidor Trends172.IA activo y escuchando desde Railway 👌');
});

// Ruta para procesar asesoramiento y generar imagen
app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
  const descripcion = req.body.descripcion;
  const nombreArchivo = req.file?.originalname;

  console.log('📝 Descripción recibida:', descripcion);
  if (nombreArchivo) console.log('🖼️ Imagen recibida:', nombreArchivo);

  try {
    console.log('🎯 Llamando a OpenAI para generar imagen...');

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: descripcion,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const base64 = imageResponse.data[0]?.b64_json;
    const imageDataUrl = `data:image/png;base64,${base64}`;

    console.log('✅ Imagen generada correctamente.');

    res.json({
      recomendacion: 'Aquí tienes un diseño sugerido para tu espacio.',
      imagen: imageDataUrl,
    });
  } catch (error) {
    console.error('❌ Error al generar la imagen:', error.message);
    res.status(500).json({ mensaje: 'Error al generar imagen con OpenAI.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
  console.log(`==> Your service is live 🎉`);
});
