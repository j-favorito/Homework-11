const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const fs = require("fs")
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//const savedNotes=[];

//displays json in terminal
const savedData=fs.readFileSync(path.join(__dirname+"/db/db.json"),"utf-8");
console.log(JSON.parse(savedData));

//sends note page
app.get("/notes", (req, res) => {
    res.sendFile(__dirname + "/public/notes.html");
});

//creates api page
app.get("/api/notes", (req, res) => {
    const notesJson=fs.readFile(__dirname + "/db/db.json", "utf-8",function(err,data){
        res.json(JSON.parse(data));
        if (err) throw err;
    });
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.

app.post("/api/notes",(req,res)=>{
    const savedJSON=JSON.parse(fs.readFileSync(path.join(__dirname+"/db/db.json"),"utf-8"));
    const newNote=req.body;
    uniqueId=Date.now();
    newNote.id=uniqueId
    savedJSON.push(newNote);
    console.log(savedJSON);
    fs.writeFileSync(path.join(__dirname+"/db/db.json"),JSON.stringify(savedJSON));
    console.log(newNote);
    res.json(newNote);
})


//* DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. 
//This means you'll need to find a way to give each note a unique `id` when it's saved. 
//In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete('/api/notes/:id', function (req, res) {
    let savedJSON=JSON.parse(fs.readFileSync(path.join(__dirname+"/db/db.json"),"utf-8"));
    let removeId=req.params.id;
    let newJSON=savedJSON.filter(note=>note.id != removeId);
    fs.writeFileSync(path.join(__dirname+"/db/db.json"),JSON.stringify(newJSON));
    res.json(newJSON);
});


//Sends index.html as homepage
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

//creates server
app.listen(PORT, () => {
    console.log(`Server on ${PORT}`)
})