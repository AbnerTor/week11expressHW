const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//main stuff
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));




app.get('/api/notes', (req, res) => {

    let allNotes = fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8")
    allNotes = JSON.parse(allNotes);
    res.json(allNotes);
});

const newUuid = () => {
    let letters = '6b13e2d0f4c5a';
    let indexLengthArr = [8, 4, 4, 4, 12];
    let res = ['', '', '', '', ''];
    for (let i in indexLengthArr) {
        let indexLength = indexLengthArr[i];
        for (let j = 0; j < indexLength; j++) {
            let randomIndex = Math.floor(Math.random() * indexLength);
            res[i] += letters[randomIndex];               
        }      
    }
    return res.join('-');
}

//adding notes

app.post('/api/notes', (req, res) => {


    let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'),'utf8');

    allNotes = JSON.parse(allNotes);

    const newNote = req.body;

    newNote.id = newUuid();

    allNotes.push(newNote);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes));

    res.json(JSON.parse(allNotes));

});

//delete stuff

app.delete('/api/notes/:id', (req, res) => {


    let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'),'utf8');

    allNotes = JSON.parse(allNotes);

    let idFromBrowser = req.params.id;

    allNotes = allNotes.filter(note => {

        return note.id != idFromBrowser;
    })

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes));

    res.json(JSON.parse(allNotes));

});




app.listen(PORT, () => console.log(`${PORT} is working`));