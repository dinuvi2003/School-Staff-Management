
const express = require('express')
const cors = require('cors');
const app = express()



// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
	origin: [
		'http://localhost:3000',
		'http://localhost:3001'
	],
	credentials: true
}));

// import routers
const teacherRouter = require('./routes/teacher.routes')
const leaveRouter = require('./routes/leaves.routes')

// register routers
app.use("/api/teacher" ,teacherRouter)
app.use("/api/leave", leaveRouter)

module.exports = app