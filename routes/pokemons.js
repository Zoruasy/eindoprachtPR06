import express from "express";
import Pokemon from "../models/Pokemon.js";
import { faker } from "@faker-js/faker";
import cors from 'cors';

const router = express.Router();

// CORS-middleware
const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

// Voeg de middleware toe voor alle routes
router.use(corsMiddleware);

// Opties voor CORS
router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send();
});

router.options('/:_id', (req, res) => {
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send();
});


const formatPokemon = (pokemon) => ({
    id: pokemon._id,
    name: pokemon.name,
    type: pokemon.type,
    location: pokemon.location,
    _links: {
        self: {
            href: `${process.env.LOCALURL}/pokemons/${pokemon._id}`
        },
        collection: {
            href: `${process.env.LOCALURL}/pokemons`
        }
    }
});

// GET route voor Pokémons
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;

        const baseUrl = `${process.env.LOCALURL}/pokemons`;

        if (!page || !limit) {
            const pokemons = await Pokemon.find();
            const items = pokemons.map(formatPokemon);

            res.json({
                items,
                _links: {
                    self: { href: baseUrl }
                },
                pagination: {
                    currentPage: 1,
                    currentItems: items.length,
                    totalPages: 1,
                    totalItems: items.length,
                    _links: {
                        first: { page: 1, href: baseUrl },
                        last: { page: 1, href: baseUrl },
                        previous: null,
                        next: null
                    }
                }
            });
            return;
        }

        const skip = (page - 1) * limit;
        const totalItems = await Pokemon.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const pokemons = await Pokemon.find().skip(skip).limit(limit);
        const items = pokemons.map(formatPokemon);

        const pagination = {
            currentPage: page,
            currentItems: items.length,
            totalPages,
            totalItems,
            _links: {
                first: {
                    page: 1,
                    href: `${baseUrl}?page=1&limit=${limit}`
                },
                last: {
                    page: totalPages,
                    href: `${baseUrl}?page=${totalPages}&limit=${limit}`
                },
                previous: page > 1 ? {
                    page: page - 1,
                    href: `${baseUrl}?page=${page - 1}&limit=${limit}`
                } : null,
                next: page < totalPages ? {
                    page: page + 1,
                    href: `${baseUrl}?page=${page + 1}&limit=${limit}`
                } : null
            }
        };

        res.json({
            items,
            _links: {
                self: { href: `${baseUrl}?page=${page}&limit=${limit}` }
            },
            pagination
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST route om Pokémons te genereren
router.post('/seed', async (req, res) => {
    try {
        await Pokemon.deleteMany({});

        for (let i = 0; i < 30; i++) {
            await Pokemon.create({
                name: faker.name.firstName(),
                type: faker.word.adjective(),
                location: faker.address.city(),
            });
        }

        res.json({ message: 'Created pokemons' });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

// POST route voor het aanmaken van een Pokemon
router.post('/', async (req, res) => {
    try {
        console.log("Received body:", req.body); // Log de ontvangen data

        const { name, type, location } = req.body;

        if (!name || !type || !location) {
            return res.status(400).json({ error: "All fields (name, type, location) are required." });
        }

        const pokemon = await Pokemon.create({ name, type, location });

        const formattedPokemon = formatPokemon(pokemon);

        res.status(201).json({ item: formattedPokemon });
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET route voor het ophalen van een specifieke Pokemon
router.get('/:_id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findById(req.params._id);

        if (!pokemon) {
            return res.status(404).json({ error: "Pokemon not found" });
        }

        res.json(formatPokemon(pokemon));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT route voor het bijwerken van een Pokemon
router.put('/:_id', async (req, res) => {
    try {
        const { name, type, location } = req.body;

        if (!name && !type && !location) {
            return res.status(400).json({ error: "At least one field (name, type, location) is required to update." });
        }

        const pokemon = await Pokemon.findByIdAndUpdate(
            req.params._id,
            { name, type, location },
            { new: true, runValidators: true }
        );

        if (!pokemon) {
            return res.status(404).json({ error: "Pokemon not found" });
        }

        res.status(200).json({ item: formatPokemon(pokemon) });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE route voor het verwijderen van een Pokemon
router.delete('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        const result = await Pokemon.findByIdAndDelete(_id);

        if (!result) {
            return res.status(404).json({ error: "Pokemon not found" });
        }

        res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
