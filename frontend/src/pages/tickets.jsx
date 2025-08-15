import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


function Tickets() {
  // Here, we'll be desigining the tickets page, where we'll be showing all the tickets to the admin/moderator.
  const [tickets, setTickets] = useState([]);

  const getAllTickets = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message ?? "Tickets fetched successfully!");
        setTickets(data.data);
      } else {
        toast.error(data.message ?? "Failed to fetch tickets!");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets!");
    }
  };

  useEffect(() => {
    getAllTickets();
  }, []);

  const deleteTicket = async (ticketId) =>{
    if(!confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/delete/${ticketId}`, {
        method:"DELETE",
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      const data = await response.json();
      if(response.status === 200){
        toast.success(data.message ?? "Ticket deleted successfully!");    
        getAllTickets();
      }
      else{
        toast.error(data.message ?? "Failed to delete the ticket!");
      }
    } catch (e) {
      toast.error(e.message ?? "Failed to delete the ticket!");
    }
  }

  const navigate = useNavigate();
  
  return <div className="w-full flex flex-col items-center">
      {/* Go Back button on top */}
      <button
        className="btn btn-secondary mb-4 self-start"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>

      {!tickets || tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-2xl font-bold mb-4">No Tickets Available</h1>
          <p className="text-gray-600">
            There are currently no tickets to display.
          </p>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">All Tickets</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th className="col-span-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.status}</td>
                    <td>
                      {ticket.assignedTo
                        ? ticket.assignedTo.name
                        : "Unassigned"}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/ticket/${ticket._id}`)}
                      >
                        Show Details
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => deleteTicket(ticket._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  ;

}

export default Tickets;
