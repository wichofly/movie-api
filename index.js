const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    uuid = require('uuid');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

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

let topMovies = [
    {
        title: 'The Shawshank Redemption',
        director: 'Stephen King'
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

app.get('/movies', (req, res) => {
    res.json(topMovies)
});

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