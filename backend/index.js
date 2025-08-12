import express from "express"
import ConnDB from "./database/dbconn.js"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)



const startServer = async()=>{
    await ConnDB().then(()=>{
        app.listen(PORT, ()=>{
            console.log(`App running on http://localhost:${PORT}`);            
        })
    })
    .catch(e=>{
        console.error("Connection aborted due to Database Connection Failure!")
        process.exit(1)
    })
}
     

startServer()