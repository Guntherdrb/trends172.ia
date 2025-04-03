const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

// Configurar CORS para permitir peticiones desde cualquier origen
app.use(cors());

// Configurar Multer para recibir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor Trends172.IA activo y escuchando 👌');
});

// Ruta POST para recibir imagen + descripción
app.post('/api/asesoramiento', upload.single('imagen'), (req, res) => {
  const descripcion = req.body.descripcion;
  const imagen = req.file;

  console.log('📝 Descripción recibida:', descripcion);
  console.log('🖼️ Imagen recibida:', imagen?.originalname);

  // 🔮 Aquí más adelante integrarás OpenAI para análisis real

  // Simulación de asesoramiento con productos
  const productos = [
    { nombre: 'Encimera Blanca Cuarzo', descripcion: 'Superficie de cuarzo pulido de alta resistencia', precio: 250 },
    { nombre: 'Piso Vinílico Gris Claro', descripcion: 'Antideslizante e impermeable', precio: 180 },
    { nombre: 'Gabinetes Alto Brillo Blanco', descripcion: 'Gabinetes modernos estilo europeo', precio: 320 }
  ];

  const total = productos.reduce((acc, p) => acc + p.precio, 0);

  res.json({
    productos,
    total
  });
});

// Puerto dinámico para Render o 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
