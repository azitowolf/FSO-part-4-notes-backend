const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const morgan = require('morgan')
morgan.token('RequestBodyToken', function (req, res) { return JSON.stringify(req.body) });
const morganConfig = morgan(':method :url :status :res[content-length] - :response-time ms :RequestBodyToken')
app.use(morganConfig)

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  important: Boolean
})

// creates generator function
const Note = mongoose.model('Note', noteSchema)

// BEGIN API ENDPOINTS

app.get('/api/notes', (req, res) => {
  const filter = {};
  Note.find(filter)
  .then((notes) => {
    response.json(notes.map(note => note.toJSON()))
  }); 
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  // create new note
  app.post('/api/notes', (request, response, next) => {
    const body = request.body
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save()
      .then(savedNote => {
        response.json(savedNote.toJSON())
      })
      .catch(error => next(error))
  })

  // toggle importance
  app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const noteToUpdate = request.body
    notes = notes.map(note => note.id !== id ? note : noteToUpdate);
    response.json(noteToUpdate);
  })

  // delete note
  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

  app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})