const dotenv = require('dotenv')

// env variables
dotenv.config()
const PORT = process.env.PORT || 3000

const app = require("./src/app")

app.listen(PORT, () => {
    console.log(`bakend is listning in port ${PORT}`)
})