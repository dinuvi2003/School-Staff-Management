import app from "./src/app.js"
import { config } from 'dotenv'

// env variables
config()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`backend is listening on port ${PORT}`)
})