import express from 'express';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// GET /pokemon - Get all Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching Pokémon', message: err });
    }
});

// GET /pokemon/:id - Get a specific Pokémon by ID
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findById(req.params.id);
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }
        res.json(pokemon);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching Pokémon', message: err });
    }
});

// POST /pokemon - Add a new Pokémon
router.post('/', async (req, res) => {
    try {
        const { name, type, description, level, captured } = req.body;
        if (!name || !type || !description) {
            return res.status(400).json({ error: 'Name, type, and description are required' });
        }
        const newPokemon = new Pokemon({ name, type, description, level, captured });
        await newPokemon.save();
        res.status(201).json(newPokemon);
    } catch (err) {
        res.status(500).json({ error: 'Error adding Pokémon', message: err });
    }
});

// PUT /pokemon/:id - Update a Pokémon by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, type, description, level, captured } = req.body;
        if (!name || !type || !description) {
            return res.status(400).json({ error: 'Name, type, and description are required' });
        }
        const updatedPokemon = await Pokemon.findByIdAndUpdate(
            req.params.id,
            { name, type, description, level, captured },
            { new: true }
        );
        if (!updatedPokemon) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }
        res.json(updatedPokemon);
    } catch (err) {
        res.status(500).json({ error: 'Error updating Pokémon', message: err });
    }
});

// DELETE /pokemon/:id - Delete a Pokémon by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);
        if (!deletedPokemon) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }
        res.json({ message: 'Pokémon deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting Pokémon', message: err });
    }
});

export default router;