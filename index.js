import express from 'express';
import mongoose from 'mongoose';
import pokemonsRouter from './routes/pokemons.js';  // Zorg ervoor dat deze router goed gedefinieerd is

const app = express();

// Verbinden met MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

// Middleware voor JSON-gegevens (express middleware)
app.use(express.json());

// Middleware voor www-urlencoded-gegevens
app.use(express.urlencoded({ extended: true }));

// Middleware om Accept header te controleren (voor 'application/json')
app.use((req, res, next) => {
    if (req.header('Accept') !== 'application/json' && req.method !== 'OPTIONS') {
        return res.status(406).json({ error: 'Accept header must include application/json' });
    }
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Pokémon API!' });
});

// Gebruik de Pokémon router voor '/pokemons' endpoint
app.use('/pokemons', pokemonsRouter);  // Zorg ervoor dat pokemonsRouter goed is gedefinieerd

// Server starten
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is gestart op poort ${process.env.EXPRESS_PORT}`);
});
