import app from "./src/app.js"
import { config } from 'dotenv'
import dotenv from 'dotenv'


// env variables
config()
dotenv.config()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`backend is listening on port ${PORT}`)
})