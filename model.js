const mongoose = require('mongoose')

let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birthyear: Date,
        deathyear: Date
    },
    actors: [String],
    year: Number,
    score: Number,
    rating: String,
    imageURL: String,
    featured: Boolean
});