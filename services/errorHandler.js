const express = require('express')

const errorHandler = (error, request, response, next) => {  
    console.log("My own error messsage: ",error.message);
    
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'TypeError'){
        return response.status(404).send({error: 'id not found'})
    }
    //TODO: POST: CAST ERROR, KIND: NUMBER
    next(error)
}

module.exports = errorHandler