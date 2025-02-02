import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;


Pokemon.js