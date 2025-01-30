import express from 'express';
import mongoose from 'mongoose';
import pokemonsRouter from './routes/pokemons.js';  // Zorg ervoor dat het pad klopt

const app = express();

// Verbinding maken met MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`)
    .then(() => console.log('Verbonden met MongoDB'))
    .catch(err => console.log('Fout bij verbinden met MongoDB:', err));

// Middleware voor JSON-gegevens
app.use(express.json());

// Middleware voor urlencoded-gegevens
app.use(express.urlencoded({ extended: true }));

// Root route (GET /)
app.get('/', (req, res) => {
    res.send('Welcome to the Pokémon API!');
});

// Gebruik de pokemonsRouter voor de /pokemon route
app.use('/pokemon', pokemonsRouter);

// Start de server
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server gestart op http://localhost:${process.env.EXPRESS_PORT}`);
});
