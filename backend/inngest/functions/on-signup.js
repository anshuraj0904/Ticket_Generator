import {inngest} from "../client.js"
import User from "../../models/user.model.js"
import { NonRetriableError } from "inngest"
import { sendMail } from "../../utils/mailer.util.js"

export const onUserSignup =  inngest.createFunction( // Note:- Here, we're just creating a function, and not an agent.
    {id:"on-user-signup", retries:2},
    {event: "user/signup"},

    async({event, step})=>{
        // Event is like checking for the thing/Event-A to have happened before running a step function(the Automation part).
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async()=>{ // Here, we're storing this step in the variable, so that we can use the user's credentials somewhere. 
            const userObject= await User.findOne({email})
                if(!userObject)
                {
                    throw new NonRetriableError("User no loner exists in our Database!") // This NonRetriableerror comes from the inngest itself.

                }
                return userObject 
                // This userObject will be accessible with the variable name 'user'. And, this will be returned, only if the user exists.
            })

            // Note:- These steps are like promises, that is, we'll automatically go to the step-2(the second time where step is defined in the same scope), if the previous step has run successfully.
            // Let us write our step-2 here.
            await step.run("send-welcome-mail", async()=>{
                const subject = `Welcome to the app, ${user ? user.name : 'User !' }`
                const message = `Hi,
                \n\n
                Thanks for signing up. We are glad to have you onboard!`

                await sendMail(user.email, subject, message)

                return {success:true}
            })
            // And, like this, we've written our first two pipelines.(And, like this, we can create multiple ones.)
        } catch (e) {
            console.error("❌ Error running the step", e)
            return {success:false}
        } 
    }
)