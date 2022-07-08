const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    uuid = require('uuid');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');
const { send } = require('process');

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })


app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server

app.use(bodyParser.urlencoded({ //support parsing of application/x-www-form-urlencoded post data
    extended: true
}));

app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(methodOverride());

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
            birth: 'January 28, 1959 in Montbéliard, Doubs, France'
        }
    },
    {
        title: 'Lord of the Rings',
        director: 'J.R.R. Tolkien'
    },
    {
        title: 'Coco',
        director: 'Lee Unkrich'
    },
    {
        title: 'Braveheart',
        director: 'Randall Wallace'
    },
    {
        title: 'Midway',
        director: 'Craig L. Symonds'
    },
    {
        title: 'Red Tails',
        director: 'John Ridley'
    },
    {
        title: 'Batman The Dark knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'Matrix',
        director: 'Lana Wachowski'
    },
    {
        title: 'John Wick',
        director: 'Derek Kolstad'
    },
    {
        title: 'Forrest Gump',
        director: 'Winston Groom'
    },
];

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
    /* try {
        throw new Error({ stack: 'ere' });
    } catch (error) {
        next(error)
    }*/
    res.sendFile('public/documentation.html', { root: __dirname });
});

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
    //res.json(movies)
});

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

// READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

app.get('*', (req, res) => {
    res.send(`I don't know that path!`)
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Sorry...')
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});