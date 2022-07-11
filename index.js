const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path
    path = require('path'),
    uuid = require('uuid');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');
const { send, title } = require('process');

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

let users = [
    {
        id: 1,
        username: 'juliamaria123',
        password: 'juliaamarillo0022',
        email: 'juliamaria@gmail.com',
        birthday: '18-04-1988',
        favoriteMovies: ['Lord of the Rings'],


    },
    {
        id: 2,
        username: 'elver_75',
        password: 'iamthebest7788',
        email: 'elver_75@gmail.com',
        birthday: '20-07-1975',
        favoriteMovies: [],
    },
    {
        id: 3,
        username: 'davidpower',
        password: 'sanjuandeargentina0987',
        email: 'david_elgrande@gmail.com',
        birthday: '02-06.1996',
        favoriteMovies: [],
    },
]

let movies = [
    {
        id: '1',
        title: 'The Shawshank Redemption',
        description: 'It tells the story of banker, who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence.',
        genre: {
            id: '',
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            id: '',
            name: 'Frank Darabont',
            bio: 'Frank Darabont is a Hungarian-American director, producer, and screenwriter. He is best known for his film adaptations of Stephen King stories, including The Shawshank Redemption, The Green Mile, and The Mist. He also works as a producer, producing such television shows as The Walking Dead and Mob City.',
            birthyear: 'January 28, 1959',
            deathyear: ''
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '2',
        title: 'Lord of the Rings',
        description: 'A fellowship of hobbits, elves, dwarfs, and men is formed to destroy the ring by casting it into the volcanic fires of the Crack of Doom, where it was forged. They are opposed on their harrowing mission by the evil Sauron and his Black Riders.',
        genre: {
            id: '',
            name: 'High fantasy',
            description: 'High fantasy is set in an alternative, fictional ("secondary") world, rather than the "real" or "primary" world. This secondary world is usually internally consistent, but its rules differ from those of the primary world.',
        },
        director: {
            id: '',
            name: 'Peter Jackson',
            bio: ' is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. ',
            birthyear: 'October 31,  1961',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '3',
        title: 'Coco',
        description: `The story follows a 12-year-old boy named Miguel who is accidentally transported to the Land of the Dead, where he seeks the help of his deceased musician great-great-grandfather to return him to his family among the living and to reverse his family's ban on music.`,
        genre: {
            id: '',
            name: 'Animated',
            description: 'Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.',
        },
        director: {
            id: '',
            name: 'Lee Unkrich',
            bio: 'Lee Edward Unkrich is an American retired film director, film editor, screenwriter, and animator. He was a longtime member of the creative team at Pixar, where he started in 1994 as a film editor. He later began directing, first as co-director of Toy Story 2. Cleveland, Ohio, U.S.',
            birthyear: 'August 8, 1967',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '4',
        title: 'Braveheart',
        description: `Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England. William Wallace is a Scottish rebel who leads an uprising against the cruel English ruler Edward the Longshanks, who wishes to inherit the crown of Scotland for himself.`,
        genre: {
            id: '',
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            id: '',
            name: ' Mel Gibson',
            bio: `Mel Colmcille Gerard Gibson was the sixth of 11 children of Hutton and Ann Gibson, Roman Catholics of Irish descent. Shortly after the onset of the Vietnam War, Hutton Gibson relocated his family to Australia for fear that his sons would be drafted into battle.`,
            birthyear: 'January 3, 1956',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '5',
        title: 'Midway',
        description: 'The film, based on the real-life events of this heroic feat, tells the story of the leaders and soldiers who used their instincts, fortitude and bravery to overcome the odds. In May 1942 the Imperial Japanese Navy launches an attack on the island of Midway in the Pacific Ocean.',
        genre: {
            id: '',
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
        },
        director: {
            id: '',
            name: 'Roland Emmerich',
            bio: `Roland Emmerich is a German film director and producer of blockbuster films like The Day After Tomorrow (2004), Godzilla (1998), Independence Day (1996) and The Patriot (2000). Before fame, he originally wanted to be a production designer, but decided to be a director, after watching the original Star Wars (1977).`,
            birthyear: 'November 10, 1955',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '6',
        title: 'Hangover',
        description: 'The story was about three friends who lose the groom at his Las Vegas bachelor party and then must retrace their steps to figure out what happened. It was then rewritten by Jeremy Garelick and director Todd Phillips, who added additional elements such as Mike Tyson and his tiger, the baby, and the police cruiser.',
        genre: {
            id: '',
            name: 'Comedy',
            description: 'Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.',
        },
        director: {
            id: '',
            name: 'Todd Phillips',
            bio: 'Todd Phillips is an American filmmaker and actor who got his start by directing the comedy films Road Trip and Old School, the earlier inspired EuroTrip. He also directed Starsky & Hutch, The Hangover trilogy, Due Date, War Dogs and School for Scoundrels.',
            birthyear: 'December 20, 1970',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '7',
        title: 'Batman The Dark knight',
        description: 'Set within a year after the events of Batman Begins (2005), Batman, Lieutenant James Gordon, and new District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City, until a mysterious and sadistic criminal mastermind known only as "The Joker" appears in Gotham, creating a new wave of chaos.',
        genre: {
            id: 'Action',
            name: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
            description: '',
        },
        director: {
            id: '',
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan, (born July 30, 1970, London, England), British film director and writer acclaimed for his noirish visual aesthetic and unconventional, often highly conceptual narratives. Nolan was raised by an American mother and a British father, and his family spent time in both Chicago and London.',
            birthyear: 'July 30, 1970',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '8',
        title: 'The Silence of the Lambs',
        description: 'Young F.B.I. trainee Clarice Starling (Jodie Foster) is assigned to help find a missing woman to save her from a psychopathic serial killer (Ted Levine) who skins his victims. Clarice attempts to gain a better insight into the twisted mind of the killer by talking to another psychopath: Dr.',
        genre: {
            id: '',
            name: 'Thriller',
            description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience.',
        },
        director: {
            id: '',
            name: 'Jonathan Demme',
            bio: 'Demme was the son of Dorothy Louise (née Rogers) and Robert Eugene Demme, a public relations executive. He was raised in Rockville Centre, New York and Miami, where he graduated from Southwest Miami High School before attending the University of Florida.',
            birthyear: 'February 22, 1944',
            deathyear: 'April 26, 2017',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '9',
        title: 'The Hobbit',
        description: `The Hobbit is set within Tolkien's fictional universe and follows the quest of home-loving Bilbo Baggins, the titular hobbit, to win a share of the treasure guarded by a dragon named Smaug. Bilbo's journey takes him from his light-hearted, rural surroundings into more sinister territory.`,
        genre: {
            id: '',
            name: 'High fantasy',
            description: 'High fantasy is set in an alternative, fictional ("secondary") world, rather than the "real" or "primary" world. This secondary world is usually internally consistent, but its rules differ from those of the primary world.',
        },
        director: {
            id: '',
            name: 'Peter Jackson',
            bio: ' is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. ',
            birthyear: 'October 31,  1961',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
    },
    {
        id: '10',
        title: 'Forrest Gump',
        description: `Forrest Gump, an innocent and kind-hearted Alabama boy, has been dealing with other people's unkindness nearly all his life. Having grown up with beautiful Jenny, his only friend, Forrest yearns to learn all about the ways of the world and embarks on a mission to find his true purpose in life.`,
        genre: {
            id: '',
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
        },
        director: {
            id: '',
            name: 'Robert Zemeckis',
            bio: 'Robert Zemeckis, in full Robert Lee Zemeckis is an American director and screenwriter known for crowd-pleasing films that often made innovative use of special effects.',
            birthyear: 'May 14, 1952',
            deathyear: '',
        },
        imageURL: '',
        featured: '',
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

// CREATE
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

// CREATE
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

// UPDATE
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

// DELETE
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

// DELETE
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