const {createClient} = require('@supabase/supabase-js')

const SUPABASE_URL= process.env.SUPABASE_URL
const SUPABASE_ANNON_KEY = process.env.SUPABASE_ANON_KEY

let supabase_client = null

try{
    supabase_client = createClient(SUPABASE_URL, SUPABASE_ANNON_KEY)
    console.log("database successfully connected")
}
catch(err) {
    console.log(`Something went wrongin database connection... ${err}`)
}

module.exports = supabase_client