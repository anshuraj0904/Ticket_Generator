import express from "express"
import ConnDB from "./database/dbconn.js"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"
import ticketRoutes from "./routes/ticket.route.js"
import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import {onUserSignup} from "./inngest/functions/on-signup.js"
import {onTickerCreated} from "./inngest/functions/on-ticket-create.js"


const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/inngest",
    serve({
        client:inngest,
        functions: [onUserSignup, onTickerCreated]
    })
)
// This last one is for making the inngest work.
// Additionally, we need to add a line in our scripts of the package,json for inngest's server to work.  

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
