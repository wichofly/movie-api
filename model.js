const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

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
});

userSchema.statics.hashPassword = (password) => {   // hashPassword function, which is what does the actual hashing of submitted passwords. 
    return bcrypt.hashSync(password, 10);          
  };

  
userSchema.methods.validatePassword = function(password) { // validatePassword, is what compares submitted hashed passwords with the hashed passwords stored in your database.
    return bcrypt.compareSync(password, this.password);      // Don't use arrow functions when defining instance methods //
  };


// Making a model with the above schemas, Mongoose is gonna create collections with the names "movies" and "users" in plural although that is written in singular and the first letter is uppercase.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// This will let you then import these models into your “index.js” file 
module.exports.Movie = Movie;
module.exports.User = User;
