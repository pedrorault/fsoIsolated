require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
console.log("connecting to ",url);

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true})
        .then(result=>console.log("Connected to MongoDB")) 
        .catch(e=>console.log('error connecting to MongoDB: ',e.message))

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    number:{
        type:Number,
        required:true
    }
})

personSchema.set('toJSON', {
    transform: (document,returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model("Person",personSchema)
