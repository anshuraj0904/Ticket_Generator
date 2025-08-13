import Ticket from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";

export const createTicket = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({
          message: "Please pass all the required info for raising a ticket!",
        });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString,
    });

    await inngest.send({
      name: "user/ticketCreation",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
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
    if (user.role !== "user") {
      tickets = await Ticket.find({}).populate(
        "assignedTo",
        ["email", "name"].sort({ createdAt: -1 })
        // Note:- In the tickets model, we've assignedTo:   { type: mongoose.Schema.Types.ObjectId,ref:"User"}.
        // Here, the populate method will take the _id of the assignedTo, go to User model only(due to ref), and will look out for the asked for details there.
      );
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ data: tickets });
  } catch (e) {
    console.error("Error fetching the tickets!" + e.message);
    return res.status(401).json({ message: "Internal Server Error!" });
  }
};

export const getTicket = async (req, res) => {
  // This one's for getting the details of one particular ticket.
  const user = req.user;
  let ticket;
  try {
    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email, name",
      ]);
      // We'll be passing the id of the ticket as the param.
    } else {
      ticket = await Ticket.findOne({ createdBy: user._id, _id: req.params.id })
        .select("title description status createdAt")
        .populate("assignedTo", ["email", "name"]);
      // Note:- .select("-abc") will return all fields except the abc, but .select("abc") will return only the abc part of it, so, it can bbe used both ways, that is, for selection and well as for deselection.
    }
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
