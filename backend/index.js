import express from "express"
import ConnDB from "./database/dbconn.js"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
app.use(express.json())
app.use(cors())



const startServer = async()=>{
  try {
     await ConnDB();
     app.listen(PORT, ()=>{
        console.log(`Listening on https://localhost:${PORT}`);
    })
  } catch (error) {
    console.log("❌ Server start aborted due to DB connection failure.");
    
  }
}

startServer()