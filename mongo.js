// mongodb+srv://fullstack:<password>@fullstack-cluster.axkrj.mongodb.net/<dbname>?retryWrites=true&w=majority
// Replace <password> with the password for the fullstack user.
// Replace <dbname> with the name of the database that connections will use by default.

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Provide password as an argument!')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@fullstack-cluster.axkrj.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log(`Phonebook (${result.length}):`)
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number
  })
  
  person.save().then(result => {
    console.log(`Succesfully added ${result.name} ${result.number} to the phonebook database.`)
    mongoose.connection.close()
  })
}
else {
  console.log("Invalid amount of arguments!");
  mongoose.connection.close()
}