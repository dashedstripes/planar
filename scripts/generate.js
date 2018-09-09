// Generate a new schema, or object based on schema
const glob = require('glob')
const prompt = require('prompt')
const fs = require('fs')

let args = process.argv.splice(process.execArgv.length + 2)

if (args[0] === 'schema') {
  console.log('Generating a new Schema')
}

if (args[0] !== 'schema') {
  glob.sync('./schema/*.json').forEach((schemaFile) => {
    if (schemaFile.includes(args[0])) {
      // Adding a dot before so that it requires from the right directory
      // for some reason glob.sync works from root
      let schema = require('.' + schemaFile)
      generateNewObjectFromSchema(schema)
    }
  })
}

function generateNewObjectFromSchema(schema) {
  let questions = [
    'id',
    'title'
  ]

  schema.fields.forEach((field) => {
    questions.push(field.id)
  })

  prompt.start()

  prompt.get(questions, (err, result) => {
    fs.writeFile(`./objects/${schema.id}/${result.id}.json`, JSON.stringify(result), function (err) {
      if (err) throw err;
      console.log(`${schema.id} - ${result.id} Created.`);
    })
  })
}