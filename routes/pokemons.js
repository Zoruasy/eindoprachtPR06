import express from 'express';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// GET all Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new Pokémon
router.post('/', async (req, res) => {
    const pokemon = new Pokemon({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        level: req.body.level
    });

    try {
        const newPokemon = await pokemon.save();
        res.status(201).json(newPokemon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET specific Pokémon
router.get('/:id', getPokemon, (req, res) => {
    res.json(res.pokemon);
});

// PUT (update) Pokémon
router.put('/:id', getPokemon, async (req, res) => {
    if (req.body.name != null) {
        res.pokemon.name = req.body.name;
    }
    if (req.body.type != null) {
        res.pokemon.type = req.body.type;
    }
    if (req.body.level != null) {
        res.pokemon.level = req.body.level;
    }

    try {
        const updatedPokemon = await res.pokemon.save();
        res.json(updatedPokemon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Pokémon
router.delete('/:id', getPokemon, async (req, res) => {
    try {
        await res.pokemon.deleteOne();
        res.json({ message: 'Pokemon deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get Pokemon by ID
async function getPokemon(req, res, next) {
    let pokemon;
    try {
        pokemon = await Pokemon.findById(req.params.id);
        if (pokemon == null) {
            return res.status(404).json({ message: 'Cannot find pokemon' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.pokemon = pokemon;
    next();
}

export default router;