const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('withPOST',(req,res)=>{
    if(req.method=="POST"){
       return JSON.stringify(req.body)
    }
})

app.use(morgan((tokens,req,res)=>{    
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['withPOST'](req,res)
      ].join(' ')    
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id',(request,response)=>{
    const id = (request.params.id)
    const hex  = new RegExp(/^[0-9A-F]{24}$/, 'i')
    
    if(hex.test(id)){
        Person.find({ _id: id }).then(person =>        
        {     
            if(person.length !== 0){
                response.json(person[0].toJSON())
            }else{
                response.status(404).send({error: `person with id ${id} not found`})
            }
        }).catch(e=>console.log("error: ", e))
    }else{
        response.status(400).send({error: "id specified is not a 24 digit hex number"})
    }
})
app.delete('/api/persons/:id',(request,response)=> {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(res => {        
        response.status(204).end()
    })    
})

app.post('/api/persons/',(request,response)=>{
    const body = request.body
    if(!body.name){
        return response.status(409).json({error:"name is missing"})
    }
    if(!body.number){
        return response.status(409).json({error:"number is missing"})
    }
    const person = new Person({
        "name":body.name,
        "number":body.number
    })
    person.save().then(person=>{
        response.json(person.toJSON())
    }).catch(e=>console.log(e))
})

app.get('/info', (request,response) => {
    Person.find({}).then(person=>{
        response.send(`<p>Phonebook has info for ${person.length} persons</p>${new Date()}`)
    })    
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})