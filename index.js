const express = require('express')
const app = express()

app.use(express.json())

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
  const randomId = Math.floor(Math.random() * 100000) + 1;
  
  const person = request.body
  person.id = randomId

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})