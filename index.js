require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function (request, response) {
  return JSON.stringify(request.body)
})

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

/*const containsName = (name) => {
  return persons.some(person =>
    person.name.toLowerCase().trim() === name.toLowerCase().trim())
}*/

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const personAmount = persons.length
    const date = new Date();
    const info = `<p>The phonebook backend contains info of ${personAmount} people.</p>
      <p>Backend time: ${date}</p>`
    response.send(info)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'No name provided. Name is required!'
    })
  }
  else if (body.number === undefined) {
    return response.status(400).json({
      error: 'No number provided. Number is required!'
    })
  }
  /*else if (containsName(body.name)) { // TODO
    return response.status(400).json({
      error: 'Name is reserved. Unique name is required!'
    })
  }*/

  const person = new Person({
    name: body.name.trim(),
    number: body.number.trim()
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})