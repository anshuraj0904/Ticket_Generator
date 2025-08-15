import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { handleLogout } from "../utils/handleLogout.js";

function User() {
  const navigate = useNavigate();
  const [myTickets, setMyTickets] = useState([]);

  const fetchMyTickets = async () => {
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
        console.log("Tickets fetched successfully:", data);
        toast.success("Tickets fetched successfully");
        setMyTickets(data.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    }
  };

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
        fetchMyTickets();
      }
      else{
        toast.error(data.message ?? "Failed to delete the ticket!");
      }
    } catch (e) {
      toast.error(e.message ?? "Failed to delete the ticket!");
    }
  }


  
  useEffect(() => {
    fetchMyTickets();
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Common Header */}
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Welcome {user.name}</div>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {navigate("/create-ticket")}}
      >
        + Create Ticket
      </button>
        <button
          className="btn btn-error btn-sm"
          onClick={() => handleLogout(navigate)}
        >
          Logout
        </button>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-1 flex items-center justify-center">
        {!myTickets || myTickets.length === 0 ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Tickets Available</h1>
            <p className="text-gray-600">
              There are currently no tickets to display.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center ">My Tickets</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th className="colspan-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myTickets.map((ticket) => (
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
                        <button className="btn btn-info btn-sm" onClick={() => navigate(`/ticket/${ticket._id}`)}>
                        Show Details
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => deleteTicket(ticket._id)}>
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
      </main>
    </div>
  );
}

export default User;
