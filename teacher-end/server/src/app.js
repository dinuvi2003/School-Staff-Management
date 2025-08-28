const express = require('express')
const app = express()


// middlewares
app.use(express.json())

// import routers
const teacherRouter = require('./routes/teacher.routes')

// register routers
app.use("/api/teacher" ,teacherRouter)

module.exports = app