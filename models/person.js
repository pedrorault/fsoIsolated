require('dotenv').config()
const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI
console.log('connecting to ',url)

mongoose.connect(url,{ useNewUrlParser:true, useUnifiedTopology:true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(e => console.log('error connecting to MongoDB: ',e.message))

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number:{
        type:Number,
        required:true
    }
})
personSchema.plugin(mongooseUnique)

personSchema.set('toJSON', {
    transform: (document,returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person',personSchema)
