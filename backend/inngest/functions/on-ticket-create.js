import analyzeTicket from "../../utils/ai-ticket-analyzer.util.js";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import { NonRetriableError } from "inngest";
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.util.js";

export const onTickerCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "user/ticketCreation" },

  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // Fetching the ticket from the DB.
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);

        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found!");
        }
        return ticketObject; // We'll be getting the ticket's details from here.
      });
      // 2nd Step, wherein we'll be updating the things.
      // Here, as we won't be returning anything, so, we don't need to store it in any variable.
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdandUpdate(ticket._id, {
          status: "TODO",
        }); // Here, we're just updating the status to TODO for the ticket that we've got.

        // Step-2 is done above.

        // Now, we'll be creating the step-3 for further updating the details of the ticket.

        const aiResponse = await analyzeTicket(ticket);

        const relatedSkills = await step.run("ai-processing", async () => {
          let skills = [];

          if (aiResponse) {
            await Ticket.findByIdandUpdate(ticket._id, {
              priority: !["low", "medium", "high"].includes(aiResponse.priority)
                ? "medium"
                : aiResponse.priority,
              // That is, if the priority of aiResponse is not there, or is there but doesn't hhave one of low, medium or high,  we'll put 'medium'. Else, we'll put that value in the priority of ticket.
              helpfulNotes: aiResponse.helpfulNotes,
              status: "IN_PROGRESS",
            });
            skills = aiResponse.relatedSkills; // We'll be passing the skills to the 4th step.
          }

          return skills;
        });

        const moderator = await step.run("assign-ticket", async () => {
          // Here, we'll be using the mongo pipeline.
          let user = await User.findOne({
            role: "moderator",
            skills: {
              $elemMatch: {
                $regex: relatedSkills.join("|"),
                $options: "i",
              },
            },
          });
          if (!user) {
            user = await User.findOne({ role: "admin" });
          }

          // Let us now assign it:
          await Ticket.findByIdandUpdate(ticket._id, {
            assignedTo: user?._id || null,
          });
          return user;
        });

        // Let us create another pipe to send an email to the user to whom the task has been assigned.
        await step.run("send-email-notification", async () => {
          if (moderator) {
            const ticketDets = await Ticket.findById(ticketId);
            const subject = "New Ticket assigned!";
            const message = `Hey ${moderator.name}, a new has been assigned to you.
\n\n
The details are:
- Title: ${ticketDets.title}
- Priority: ${ticketDets.priority}`;

            await sendMail(moderator.email, subject, message);
          }
        });

        // Let us go one step ahead and let us now notify the user, who created the ticket that, his issue has been passed on to a mod now.
        await step.run("notify-user", async () => {
          const userToNotify = await User.findById(ticket.createdBy);
          const Allskills = moderator.skills;

          const subject = "You ticket got assigned!";
          const message = `Hey ${userToNotify.name}, we're happy to notfiy that your issue has been assigned to a moderator.
\n\n
Here are the details:
- Name : ${moderator.name} 
- Role: ${moderator.role}
- Skills: ${Allskills.join(", ")}`;
          await sendMail(userToNotify.email, subject, message);
        });
      });
      return { success: true };
    } catch (e) {
      console.error("❌ Error running the step!");
      return { success: false, message: e.message };
    }
  }
);
