import { inngest } from "../client.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.util.js";

export const onTicketDelete = inngest.createFunction(
  { id: "on-ticket-deletion", retries: 2 },
  { event: "user/ticketDeletion" },

  async ({ event, step }) => {
    try {
      const { email, ticketId } = event.data;
      
      const user = await step.run("get-ticket-detail", async () => {
        const userObject = await User.findOne({email});
        if (!userObject) {
          throw new NonRetriableError("User not found!");
        }
        return userObject;
      });

      await step.run("send-deletion-mail", async () => {
        const subject = "Your ticket has been deleted!";
        const message = `Hey ${user ? user.name : "User !"}
\n
Your Ticket with ticket no. ${ticketId} has been deleted as it was resolved successfully!
`;
        await sendMail(email, subject, message);
        return { success: true };
      });
    } catch (e) {
      console.error("❌ Error sending the email: ", e);
      return { success: false };
    }
  }
);
