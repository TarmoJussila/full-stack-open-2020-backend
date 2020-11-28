const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

morgan.token('body', function (request, response) {
  return JSON.stringify(request.body)
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234567",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "044-0987654",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "050-1284096",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "055-2561024",
  }
]

const generateId = () => {
  const randomId = Math.floor(Math.random() * 100000) + 1
  return randomId
}

const containsName = (name) => {
  return persons.some(person =>
    person.name.toLowerCase().trim() === name.toLowerCase().trim())
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const personAmount = persons.length
  const date = new Date();
  const info = `<p>The phonebook backend contains info of ${personAmount} people.</p>
    <p>Backend time: ${date}</p>`

  response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'No name provided. Name is required!'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'No number provided. Number is required!'
    })
  }
  else if (containsName(body.name)) {
    return response.status(400).json({
      error: 'Name is reserved. Unique name is required!'
    })
  }

  const person = {
    id: generateId(),
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})