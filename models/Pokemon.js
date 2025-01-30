import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: Number, default: 1 },
    captured: { type: Boolean, default: false }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
