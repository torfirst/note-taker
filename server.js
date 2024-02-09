const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
  });
  
  // API Routes
  app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = generateUniqueId(); // You need to implement this function
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  });
  
  // Bonus: DELETE Route
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.send(`Note with ID ${noteId} deleted.`);
  });

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  // Server Listening
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  // Function to generate a unique ID (you can use a library like uuid)
  function generateUniqueId() {
    const noteId = uuidv4();
    return noteId;
  }
