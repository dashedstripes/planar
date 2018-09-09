const express = require('express')
const glob = require('glob')
const path = require('path')
const app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }))


// Generate routes for all objects (list and single views)
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

// Generate routes for all pages
glob.sync('./views/pages/*.pug').forEach((page) => {
  let pageName = path.basename(page, '.pug')
  app.get(`/${pageName}`, (req, res) => res.render(`pages/${pageName}`))
})

app.listen(3000, () => console.log('http://localhost:3000'))