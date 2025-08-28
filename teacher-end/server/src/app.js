const express = require('express')
const app = express()


// middlewares
app.use(express.json())

// import routers
const teacherRouter = require('./routes/teacher.routes')
const leaveRouter = require('./routes/leaves.routes')

// register routers
app.use("/api/teacher" ,teacherRouter)
app.use("/api/leave", leaveRouter)

module.exports = app