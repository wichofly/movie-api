/* Integrating Mongoose to perform CRUD operations on MongoDB data.
-----------------------------------------------------------------------------------*/
const mongoose = require('mongoose');
const Models = require('./model.js');

const Movies = Models.Movie; // Refers to the model names created in "model.js"
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }) // Allows mongoose to connect to myFlixDB database

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Now, your connection URI will never be exposed in your “index.js” file. This is much more secure!
/*---------------------------------------------------------------------------------*/

const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    uuid = require('uuid');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');
const { send, title } = require('process');

// CORS - Place before route middleware - Restrict access to API
const cors = require('cors');

const { check, validationResult } = require('express-validator');

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.

app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

// Allows requests from all origins
//app.use(cors());

     // Allow certain origins to have access, replace app.use(cors()) and use:
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app); // note the app argument you're passing here. This ensures that Express is available in your “auth.js” file as well.

const passport = require('passport');
require('./passport');

app.use(methodOverride());

let users = [
    {
        id: 1,
        username: 'juliamaria123',
        password: 'juliaamarillo0022',
        email: 'juliamaria@gmail.com',
        birthday: '1988-04-18',
        favoriteMovies: []
    },
    {
        id: 2,
        username: 'elver_75',
        password: 'iamthebest7788',
        email: 'elver_75@gmail.com',
        birthday: '1975-07-20',
        favoriteMovies: [],
    },
    {
        id: 3,
        username: 'davidpower',
        password: 'sanjuandeargentina0987',
        email: 'david_elgrande@gmail.com',
        birthday: '1996-06-02',
        favoriteMovies: [],
    },
    {
        id: 4,
        username: 'joe_80',
        password: 'joedb123',
        email: 'joe80@gmail.com',
        birthday: '1993-07-16',
        favoriteMovies: [],
    },
    {
        id: 5,
        username: 'maria-julia',
        password: 'mariajulia123',
        email: 'maria_julia@gmail.com',
        birthday: '1988-11-01',
        favoriteMovies: [],
    },
]

let movies = [
    {
        title: 'The Shawshank Redemption',
        description: 'It tells the story of banker, who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence.',
        genre: {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            name: 'Frank Darabont',
            bio: 'Frank Darabont is a Hungarian-American director, producer, and screenwriter. He is best known for his film adaptations of Stephen King stories, including The Shawshank Redemption, The Green Mile, and The Mist. He also works as a producer, producing such television shows as The Walking Dead and Mob City.',
            birthyear: 'January 28, 1959',
            deathyear: ''
        },
        actors: ['Tim Robbins', 'Morgan Freeman'],
        year: 1994,
        score: 9.3,
        rating: 'R',
        imageURL: 'https://www.imdb.com/title/tt0111161/mediaviewer/rm10105600/?ref_=tt_ov_i',
        featured: true
    },
    {
        title: 'Lord of the Rings',
        description: 'A fellowship of hobbits, elves, dwarfs, and men is formed to destroy the ring by casting it into the volcanic fires of the Crack of Doom, where it was forged. They are opposed on their harrowing mission by the evil Sauron and his Black Riders.',
        genre: {
            name: 'High fantasy',
            description: 'High fantasy is set in an alternative, fictional ("secondary") world, rather than the "real" or "primary" world. This secondary world is usually internally consistent, but its rules differ from those of the primary world.',
        },
        director: {
            name: 'Peter Jackson',
            bio: ' is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. ',
            birthyear: 'October 31,  1961',
            deathyear: '',
        },
        actors: ['Elijah Wood', 'Ian Mckellen', 'Orlando Bloom', 'Viggo Mortensen'],
        year: 2001,
        score: 8.8,
        rating: 'PG-13',
        imageURL: 'https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i',
        featured: true
    },
    {
        title: 'Coco',
        description: `The story follows a 12-year-old boy named Miguel who is accidentally transported to the Land of the Dead, where he seeks the help of his deceased musician great-great-grandfather to return him to his family among the living and to reverse his family's ban on music.`,
        genre: {
            name: 'Animated',
            description: 'Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.',
        },
        director: {
            name: 'Lee Unkrich',
            bio: 'Lee Edward Unkrich is an American retired film director, film editor, screenwriter, and animator. He was a longtime member of the creative team at Pixar, where he started in 1994 as a film editor. He later began directing, first as co-director of Toy Story 2. Cleveland, Ohio, U.S.',
            birthyear: 'August 8, 1967',
            deathyear: '',
        },
        actors: ['Anthony Gonzalez', 'Gael Garcia Bernal', 'Benjamin Bratt',],
        year: 2017,
        score: 8.4,
        rating: 'PG',
        imageURL: 'https://www.imdb.com/title/tt2380307/mediaviewer/rm585455872/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'Braveheart',
        description: `Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England. William Wallace is a Scottish rebel who leads an uprising against the cruel English ruler Edward the Longshanks, who wishes to inherit the crown of Scotland for himself.`,
        genre: {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            name: ' Mel Gibson',
            bio: `Mel Colmcille Gerard Gibson was the sixth of 11 children of Hutton and Ann Gibson, Roman Catholics of Irish descent. Shortly after the onset of the Vietnam War, Hutton Gibson relocated his family to Australia for fear that his sons would be drafted into battle.`,
            birthyear: 'January 3, 1956',
            deathyear: '',
        },
        actors: ['Mel Gibson', 'Sophie Marceau'],
        year: 1995,
        score: 8.4,
        rating: 'R',
        imageURL: 'https://www.imdb.com/title/tt0112573/mediaviewer/rm3170786816/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'Midway',
        description: 'The film, based on the real-life events of this heroic feat, tells the story of the leaders and soldiers who used their instincts, fortitude and bravery to overcome the odds. In May 1942 the Imperial Japanese Navy launches an attack on the island of Midway in the Pacific Ocean.',
        genre: {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
        },
        director: {
            name: 'Roland Emmerich',
            bio: `Roland Emmerich is a German film director and producer of blockbuster films like The Day After Tomorrow (2004), Godzilla (1998), Independence Day (1996) and The Patriot (2000). Before fame, he originally wanted to be a production designer, but decided to be a director, after watching the original Star Wars (1977).`,
            birthyear: 'November 10, 1955',
            deathyear: '',
        },
        actors: ['Ed Skrein', 'Patrick Wilson', 'Woody Harrelson', 'Luke Evans'],
        year: 2019,
        score: 6.7,
        rating: 'PG-13',
        imageURL: 'https://www.imdb.com/title/tt6924650/mediaviewer/rm3946167041/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'Hangover',
        description: 'The story was about three friends who lose the groom at his Las Vegas bachelor party and then must retrace their steps to figure out what happened. It was then rewritten by Jeremy Garelick and director Todd Phillips, who added additional elements such as Mike Tyson and his tiger, the baby, and the police cruiser.',
        genre: {
            name: 'Comedy',
            description: 'Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.',
        },
        director: {
            name: 'Todd Phillips',
            bio: 'Todd Phillips is an American filmmaker and actor who got his start by directing the comedy films Road Trip and Old School, the earlier inspired EuroTrip. He also directed Starsky & Hutch, The Hangover trilogy, Due Date, War Dogs and School for Scoundrels.',
            birthyear: 'December 20, 1970',
            deathyear: '',
        },
        actors: ['Zach Galifianakis', 'Bradley Cooper', 'Justin Bartha', 'Ed Helms'],
        year: 2009,
        score: 7.7,
        rating: 'R',
        imageURL: 'https://www.imdb.com/title/tt1119646/mediaviewer/rm401570304/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'Batman The Dark knight',
        description: 'Set within a year after the events of Batman Begins (2005), Batman, Lieutenant James Gordon, and new District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City, until a mysterious and sadistic criminal mastermind known only as "The Joker" appears in Gotham, creating a new wave of chaos.',
        genre: {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan, (born July 30, 1970, London, England), British film director and writer acclaimed for his noirish visual aesthetic and unconventional, often highly conceptual narratives. Nolan was raised by an American mother and a British father, and his family spent time in both Chicago and London.',
            birthyear: 'July 30, 1970',
            deathyear: '',
        },
        actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Maggie Gyllenhaal', 'Morgan Freeman'],
        year: 2008,
        score: 9.0,
        rating: 'PG-13',
        imageURL: 'https://www.imdb.com/title/tt1345836/mediaviewer/rm834516224/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'The Silence of the Lambs',
        description: 'Young F.B.I. trainee Clarice Starling (Jodie Foster) is assigned to help find a missing woman to save her from a psychopathic serial killer (Ted Levine) who skins his victims. Clarice attempts to gain a better insight into the twisted mind of the killer by talking to another psychopath: Dr.',
        genre: {
            name: 'Thriller',
            description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience.',
        },
        director: {
            name: 'Jonathan Demme',
            bio: 'Demme was the son of Dorothy Louise (née Rogers) and Robert Eugene Demme, a public relations executive. He was raised in Rockville Centre, New York and Miami, where he graduated from Southwest Miami High School before attending the University of Florida.',
            birthyear: 'February 22, 1944',
            deathyear: 'April 26, 2017',
        },
        actors: ['Jodie Foster', 'Anthony Hopkins'],
        year: 1991,
        score: 8.6,
        rating: 'R',
        imageURL: 'https://www.imdb.com/title/tt0102926/mediaviewer/rm3242988544/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'The Hobbit',
        description: `The Hobbit is set within Tolkien's fictional universe and follows the quest of home-loving Bilbo Baggins, the titular hobbit, to win a share of the treasure guarded by a dragon named Smaug. Bilbo's journey takes him from his light-hearted, rural surroundings into more sinister territory.`,
        genre: {
            name: 'High fantasy',
            description: 'High fantasy is set in an alternative, fictional ("secondary") world, rather than the "real" or "primary" world. This secondary world is usually internally consistent, but its rules differ from those of the primary world.',
        },
        director: {
            name: 'Peter Jackson',
            bio: ' is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. ',
            birthyear: 'October 31,  1961',
            deathyear: '',
        },
        actors: ['Martin Freeman', 'Ian Mckellen', 'Richard Armitage'],
        year: 2012,
        score: 7.8,
        rating: 'PG-13',
        imageURL: 'https://www.imdb.com/title/tt0903624/mediaviewer/rm3577719808/?ref_=tt_ov_i',
        featured: true,
    },
    {
        title: 'Forrest Gump',
        description: `Forrest Gump, an innocent and kind-hearted Alabama boy, has been dealing with other people's unkindness nearly all his life. Having grown up with beautiful Jenny, his only friend, Forrest yearns to learn all about the ways of the world and embarks on a mission to find his true purpose in life.`,
        genre: {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            name: 'Robert Zemeckis',
            bio: 'Robert Zemeckis, in full Robert Lee Zemeckis is an American director and screenwriter known for crowd-pleasing films that often made innovative use of special effects.',
            birthyear: 'May 14, 1952',
            deathyear: '',
        },
        actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
        year: 1994,
        score: 8.8,
        rating: 'PG-13',
        imageURL: 'https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i',
        featured: true,
    },
];

let usersMovies = [
    {
        userMovieId: '',
        userId: '',
        movieId: '',
    },
];

app.get('/', (req, res) => {
    res.send('Welcome to my movie API!');
});

app.get('/documentation', (req, res) => {
    /* try {
        throw new Error({ stack: 'ere' });
    } catch (error) {
        next(error)
    }*/
    res.sendFile('public/documentation.html', { root: __dirname });
});

// CREATE
/* 
app.post('/users', (req, res) => {
    const newUser = req.body // is posible just for this code: "app.use(bodyParser.json())". is what enables us to read data from the body object

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names')
    }
})
*/
// Now using Mongoose
app.post('/users', [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
],
    (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.username + 'already exists');
                } else {
                    Users
                        .create({
                            username: req.body.username,
                            password: hashedPassword,
                            email: req.body.email,
                            birthday: req.body.birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// CREATE
/* 
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})
*/

// CREATE. Add a movie to users list of favorite, using Mongoose
app.post('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { favoriteMovies: req.params.movieId }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// READ
/* 
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
    //res.json(movies)
});
*/

// READ get all movies using Mongoose
app.get('/movies', function (req, res) { //passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then(function (movies) {
            //.then((movies) => {
            res.status(201).json(movies);
        })
        .catch(function (error) {
            //.catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ
/* 
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})
*/

// READ Getting movie by title using Mongoose
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ title: req.params.title })
        .then((movie) => {
            res.json(movie)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ
/* 
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})
*/

// READ Getting movie by genre in Mongoose
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'genre.name': req.params.name })
        .then((movie) => {
            res.json(movie.genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
})

// READ
/*
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})
*/

// READ Getting Director in Mongoose
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'director.name': req.params.name })
        .then((movie) => {
            res.json(movie.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
})

// READ in Mongoose
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ getting a user by name in Mongoose
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ username: req.params.username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// UPDATE
/* 
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body; // is posible just for this code: "app.use(bodyParser.json())". is what enables us to read data from the body object

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})
*/

// UPDATE a user's info, by username in Mongoose
app.put('/users/:username', [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
],
    passport.authenticate('jwt', { session: false }), (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOneAndUpdate({ username: req.params.username }, {
            $set:
            {
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                birthday: req.body.birthday
            }
        },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });

// DELETE
/* 
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
        res.status(200).send(`${movieTitle} has been deleted from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})
*/

// DELETE favorite movie in user's list by movieId
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username }, {
        $pull: { favoriteMovies: req.params.movieId }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// DELETE
/* 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id)
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})
*/

// DELETE in Mongoose
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('*', (req, res) => {
    res.send(`I don't know that path!`)
})


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Sorry...')
})

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});