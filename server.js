// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const express = require('express');
const path = require('path');
const fs = require('fs');
// creates a unique hexatridecimal id
var uniqid = require('uniqid');

// empty array for saved notes
var notesArr = [];

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to serve static assets directly
app.use(express.static('public'));

//API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        err ? console.log(err): res.send(data);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // creates unique id for note object in req.body
            req.body.id = uniqid();
            // adds new note object to array of notes from readFile only if not an empty file
            if (data) {
                notesArr = JSON.parse(data);
            }

            notesArr.push(req.body);

            fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notesArr), 'utf8', (err) => {
                if (err) {console.log(err)};
            });

            res.end();
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let deleteId = req.params.id;
            notesArr = JSON.parse(data);
            notesArr = notesArr.filter((note) => {
                return note.id != deleteId;
            });
        };

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notesArr), 'utf8', (err) => {
            if (err) {console.log(err)};
        });

        res.end();
    });
});

//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});