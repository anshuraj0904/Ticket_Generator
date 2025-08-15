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

      // 1️⃣ Fetch Ticket
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) throw new NonRetriableError("Ticket not found!");
        return ticketObject;
      });

      // 2️⃣ Update status to TODO
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      // 3️⃣ AI Processing (OUTSIDE step.run to avoid nested steps)
      const aiResponse = await analyzeTicket(ticket);

      // 4️⃣ Update DB with AI results
      const relatedSkills = await step.run(
        "update-with-ai-results",
        async () => {
          if (aiResponse) {
            await Ticket.findByIdAndUpdate(ticket._id, {
              priority: ["low", "medium", "high"].includes(aiResponse.priority)
                ? aiResponse.priority
                : "medium",
              helpfulNotes: aiResponse.helpfulNotes,
              status: "IN_PROGRESS",
            });

            let skills = aiResponse.relatedSkills || [];

            // If it's a string, try to parse it
            if (typeof skills === "string") {
              try {
                const parsed = JSON.parse(skills);
                if (Array.isArray(parsed)) skills = parsed;
              } catch {
                skills = skills.split(",").map((s) => s.trim());
              }
            }
            if (skills) {
              await Ticket.findByIdAndUpdate(ticket._id, {
                relatedSkills: skills,
              });
            } else {
              await Ticket.findByIdAndUpdate(ticket._id, {
                relatedSkills: [],
              });
            }
            return skills
          }
        }
      );

      // 5️⃣ Assign ticket
      const moderator = await step.run("assign-ticket", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: { $regex: relatedSkills.join("|"), $options: "i" },
          },
        });
        if (!user) {
          user = await User.findOne({ role: "admin" });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      /*
      // 6️⃣ Email notification to moderator
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const ticketDets = await Ticket.findById(ticketId);
          const subject = "New Ticket assigned!";
          const message = `Hey ${moderator.name}, a new ticket has been assigned to you.\n\nTitle: ${ticketDets.title}\nPriority: ${ticketDets.priority}`;
          await sendMail(moderator.email, subject, message);
        }
      });

      // 7️⃣ Notify the ticket creator
      await step.run("notify-user", async () => {
        const userToNotify = await User.findById(ticket.createdBy);
        const allSkills = moderator?.skills || [];
        const subject = "Your ticket got assigned!";
        const message = `Hey ${
          userToNotify.name
        }, your issue has been assigned to ${moderator.name} (${
          moderator.role
        }).\nSkills: ${allSkills.join(", ")}`;
        await sendMail(userToNotify.email, subject, message);
      });
      */

      return { success: true };
    } catch (e) {
      console.error("❌ Error running the step!", e);
      return { success: false, message: e.message };
    }
  }
);
