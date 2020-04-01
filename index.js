const express = require('express')
const app = express()
const morgan = require('morgan')

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

let persons = [{
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        }
    ]


app.get('/api/persons', (request, response) => {
    response.json(persons)    
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find((person)=>person.id===id)
    if(person){
        response.send(person)
    }else{
        response.status(404).end()
    }
})
app.delete('/api/persons/:id',(request,response)=> {
    const id = Number(request.params.id)
    const person = persons.filter(person=>person.id!==id)
    persons= person
    response.status(204).end()
})
app.post('/api/persons/',(request,response)=>{
    const id = Math.floor(Math.random()*1000)
    const body = request.body
    if(!body.name){
        return response.status(409).json({error:"name is missing"})
    }
    if(!body.number){
        return response.status(409).json({error:"number is missing"})
    }
    if(persons.find(person=>person.name===body.name)){
        return response.status(409).json({error:"name must be unique"})
    }

    person = {
        "name":body.name,
        "number":body.number,
        "id": id
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request,response) => {    
    response.send(`<p>Phonebook has info for ${persons["persons"].length} persons</p>${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})