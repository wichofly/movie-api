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

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
})

// Making a model with the above schema, Mongoose is gonna create a collection with the name Movies in plural although that is written in singular.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('user', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
