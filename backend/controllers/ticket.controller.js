import Ticket from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";
import User from "../models/user.model.js";

export const createTicket = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({
        message: "Please pass all the required info for raising a ticket!",
      });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user?.id,
    });
    console.log("New Ticket: ", newTicket);

    await inngest.send({
      name: "user/ticketCreation",
      data: {
        ticketId: newTicket?._id.toString(),
        title,
        description,
        createdBy: req.user?.id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started!",
      ticket: newTicket,
    });
  } catch (e) {
    console.error("Error creating or processing the ticket!" + e.message);
    return res.status(401).json({ message: "Internal Server Error!" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role === "admin") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "name"]) // Select only email & name
        .sort({ createdAt: -1 }); // Sort at the query level
    } 
    else if(user.role === "user")  {
      tickets = await Ticket.find({ createdBy: user.id })
        .select("title description status createdAt")
        .populate("assignedTo", ["email", "name"])
        .sort({ createdAt: -1 });
    }

    else if(user.role === "moderator")
      {
          tickets = await Ticket.find({ assignedTo: user.id })
        .select("title description status createdAt createdBy")
        .sort({ createdAt: -1 });
      }
    
    
    if (tickets.length > 0) {
      return res.status(200).json({ data: tickets });
    } else {
      return res.status(200).json({ data: [] });
    }
  }
  catch (e) {
    console.error("Error fetching the tickets now too! " + e.message);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getTicket = async (req, res) => {
  // This one's for getting the details of one particular ticket.
  const user = req.user;

  let ticket;
  try {
    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .select(
          "title description status createdAt helpfulNotes priority relatedSkills"
        )
        .populate("assignedTo", ["email, name"]);
      // We'll be passing the id of the ticket as the param.
    } else {
      ticket = await Ticket.findOne({ createdBy: user.id, _id: req.params.id })
        .select(
          "title description status createdAt helpfulNotes priority relatedSkills"
        )
        .populate("assignedTo", ["email", "name"]);
      // Note:- .select("-abc") will return all fields except the abc, but .select("abc") will return only the abc part of it, so, it can bbe used both ways, that is, for selection and well as for deselection.
    }
    console.log(ticket);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res
      .status(200)
      .json({ message: "Ticket fetched successfully!", data: ticket });
  } catch (error) {
    console.error("Error fetching the ticket!" + e.message);
    return res.status(401).json({ message: "Internal Server Error!" });
  }
};

export const deleteTicket = async (req, res) => {
  const user = req.user;
  const ticketId = req.params.id;

  try {
    const ticketDetail = await Ticket.findById(ticketId)
      .select("status priority")
      .populate("createdBy", "email name");
    if (!ticketDetail) {
      return res.status(404).json({ message: "Ticket does not exist!" });
    } else {
      if (user.role === "moderator") {
        return res
          .status(403)
          .json({ message: "Moderators cannot delete tickets!" });
      }

      if (
        user.role === "admin" ||
        ticketDetail.createdBy._id.toString() === user.id
      ) {
        await Ticket.findByIdAndDelete(ticketId);
        const ticketUser = ticketDetail.createdBy;

        console.log("User Detail:", ticketUser.email, "Ticket Id:", ticketId);

        // await inngest.send({
        //   name: "user/ticketDeletion",
        //   data: {
        //     email: ticketUser.email,
        //     ticketId: ticketId.toString(),
        //   },
        // });

        console.log(`Deleted Ticket: `, ticketDetail);

        return res
          .status(200)
          .json({ message: "Ticket Deleted Successfully!" });
      }
    }
  } catch (e) {
    console.error("Error Deleting the Ticket:", e);
    return res.status(500).json({ message: "Error Deleting the Ticket!" });
  }
};
