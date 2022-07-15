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

// Making a model with the above schemas, Mongoose is gonna create collections with the names "movies" and "users" in plural although that is written in singular and the first letter is uppercase.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// This will let you then import these models into your “index.js” file 
module.exports.Movie = Movie;
module.exports.User = User;
