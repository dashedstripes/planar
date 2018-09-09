const express = require('express')
const glob = require('glob')
const app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }))

glob.sync('./schema/*.json').forEach((schemaFile) => {
  let schema = require(schemaFile)
  let objects = []

  glob.sync(`./objects/${schema.id}/*.json`).forEach((objectFile) => {
    let object = require(objectFile)
    objects.push(object)

    app.get(`${schema.url}/${object.id}`, (req, res) => res.render(`objects/${schema.id}/single`, { object }))
  })

  app.get(schema.url, (req, res) => res.render(`objects/${schema.id}/list`, { schema, objects }))
})

app.listen(3000, () => console.log('http://localhost:3000'))