const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar subida de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Inicializar OpenAI con tu API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🟢 Servidor Trends172.IA activo y escuchando');
});

// Ruta de asesoramiento con imagen + descripción
app.post('/api/asesoramiento', upload.single('imagen'), async (req, res) => {
  const descripcion = req.body.descripcion;

  try {
    // Paso 1: Generar recomendación de diseño con ChatGPT
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un asesor profesional en diseño interior especializado en cocinas modernas. Da recomendaciones de materiales, colores y estilo según la solicitud del usuario.'
        },
        {
          role: 'user',
          content: `Tengo esta imagen de mi espacio. Lo que quiero cambiar o decorar es lo siguiente: ${descripcion}`
        }
      ]
    });

    const textoAsesor = chatResponse.choices[0].message.content;

    // Paso 2: Generar imagen con DALL·E
    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: descripcion,
      n: 1,
      size: "512x512"
    });

    const imageUrl = imageResponse.data[0].url;

    // Respuesta al frontend
    res.json({
      recomendacion: textoAsesor,
      imagen: imageUrl
    });

  } catch (error) {
    console.error('❌ Error con OpenAI:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la solicitud con OpenAI.' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Trends172.IA escuchando en el puerto ${PORT}`);
});
