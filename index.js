const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })


app.use(morgan('combined', { stream: accessLogStream })); // setup the logger, Mildware function

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); // 
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Sorry...')
})

let topMovies = [
    {
        title: 'The Shawshank Redemption',
        author: 'Stephen King'
    },
    {
        title: 'Lord of the Rings',
        author: 'J.R.R. Tolkien'
    },
    {
        title: 'Coco',
        author: 'Lee Unkrich'
    },
    {
        title: 'Braveheart',
        author: 'Randall Wallace'
    },
    {
        title: 'Midway',
        author: 'Craig L. Symonds'
    },
    {
        title: 'Red Tails',
        author: 'John Ridley'
    },
    {
        title: 'Batman The Dark knight',
        author: 'Christopher Nolan'
    },
    {
        title: 'Matrix',
        author: 'Lana Wachowski'
    },
    {
        title: 'John Wick',
        author: 'Derek Kolstad'
    },
    {
        title: 'Forrest Gump',
        author: 'Winston Groom'
    },
];

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});