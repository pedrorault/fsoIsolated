const errorHandler = (error, request, response, next) => {
    console.log(`\nError name: ${error.name}`)
    console.log(`Error status:${error.status}`)
    console.log(`Error message: ${error.message}\n`)

    if(error.name === 'ValidationError'){
        return response.status(400).json({ error:error.message })
    }else if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformated entry' })
    }else if (error.name === 'TypeError' || error.name === 'ID not found'){
        return response.status(404).send({ error: 'Entry not found' })
    }else if(error.status === 404){
        return response.status(404).send({ error: 'Page does not exist' })
    }

    next(error)
}

module.exports = errorHandler