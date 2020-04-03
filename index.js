const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')
const errorHandler = require('./helpers/errorHandler')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('withPOST', (req, res) => {
    if (req.method == "POST") {
        return JSON.stringify(req.body)
    }
})

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['withPOST'](req, res)
    ].join(' ')
}))

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
    .catch(error=>next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = (request.params.id)
    Person.find({ _id: id })
        .then(person => {
            response.json(person[0].toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(res => {
        if (res) {
            response.status(204).end()
        } else {            
            const error = new Error()
            error.name = "ID not found"
            error.status = 404
            return next(error)
        }
    }).catch(error=>next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const body = request.body    
    const person = new Person({
        "name": body.name,
        "number": body.number
    })
    person.save().then(person => {
        response.json(person.toJSON())
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({}).then(person => {
        response.send(`<p>Phonebook has info for ${person.length} persons</p>${new Date()}`)
    })
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        "name": body.name,
        "number": body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {
            runValidators: true,
            context: 'query',
            new: true
        })
        .then(updated => {
            response.json(updated.toJSON())
        })
        .catch(error => next(error))
})

app.get("*",(request,response,next)=> {
    const error = new Error()
    error.status = 404
    next(error)
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})