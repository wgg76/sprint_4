import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import { obtenerTodosLosSuperHeroesController } from './controllers/superheroesController.mjs';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import { obtenerTodosLosSuperHeroes } from './services/superheroesService.mjs'; // Asegúrate de que esta función existe

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware para establecer un título predeterminado
app.use((req, res, next) => {
    res.locals.title = 'Mi Aplicación'; // Valor predeterminado
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

connectDB().catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
});

// Rutas
app.use(superHeroRoutes);

app.get('/dashboard', obtenerTodosLosSuperHeroesController);


// Rutas de tu aplicación
app.get('/landing', async (req, res) => {
    try {
        const superheroes = await obtenerTodosLosSuperHeroes(); // Obtén los datos de los superhéroes desde la base de datos
        res.render('home', { 
            title: 'Página Principal',
            superheroes: superheroes // Pasa la variable a la vista
        });
    } catch (error) {
        console.error('Error al obtener los superhéroes:', error);
        res.status(500).send('Error al cargar la página principal');
    }
});


// Middleware de errores 404 (debe estar al final)
app.use((req, res) => {
    res.status(404).render('404', { mensaje: "Ruta no encontrada" });
});


app.use((req, res) => {
    res.status(404).render('404', { mensaje: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
