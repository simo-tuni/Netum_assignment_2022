const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
app.use(express.static('public'))
app.use(express.json())

let DUMMY_DATA = [
  { name: 'John', lastname: 'Doe', age: 50 },
  { name: 'Mary', lastname: 'Ave', age: 35 },
  { name: 'Noel', lastname: 'Wish', age: 25 },
  { name: 'Sam', lastname: 'Take', age: 45 }
]

app.get('/api/getPeople', (req, res) => {
  res.send(DUMMY_DATA)
})

app.post('/api/addPeople', (req, res) => {
  DUMMY_DATA.push({ name: req.body.name, lastname: req.body.lastname, age: req.body.age })
  res.send(DUMMY_DATA)
})

app.post('/api/updatePeople', (req, res) => {
  const index = req.body.index
  const newname = req.body.name
  const newlastname = req.body.lastname
  const newage = req.body.age

  DUMMY_DATA.forEach((item, num) => {
    if (num === index) {
      item.name = newname
      item.lastname = newlastname
      item.age = newage
    }
  })
  res.send(DUMMY_DATA)
})

app.post('/api/deletePeople', (req, res) => {
  console.log(req.body.index)
  DUMMY_DATA = DUMMY_DATA.filter((person, num) => {
    return num !== req.body.index
  })
  res.send(DUMMY_DATA)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
