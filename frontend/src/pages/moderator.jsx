import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { handleLogout } from "../utils/handleLogout.js";

function Moderator() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
        setTickets(data.data ? data.data : []);
        console.log("Fetched Tickets: ", data.data);
               
        toast.success("Tickets fetched successfully!");
      } else {
        toast.error(data.message || "Failed to fetch tickets!");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Error fetching tickets!");
    }
  };

  useEffect(() => {
    fetchMyTickets();
  },[])

  if (!tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col">
        <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
          <div className="text-xl font-bold">Welcome Moderator, {user.name}</div>
              <div className="flex space-x-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/tickets")}
          >
            Show All Tickets
          </button>
        </div>

          <div className="flex space-x-4">
          </div>

          <button
            className="btn btn-error btn-sm"
            onClick={() => handleLogout(navigate)}
          >
            Logout
          </button>
        </header>
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Tickets Available</h1>
            <p className="text-gray-600">
              There are currently no tickets assigned to you for display.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Welcome Moderator, {user.name}</div>

        {/* <div className="flex space-x-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/tickets")}
          >
            Show All Tickets
          </button>
        </div> */}

        <button className="btn btn-error btn-sm" onClick={()=>handleLogout(navigate)}>
          Logout
        </button>
      </header>

      {/* Body */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Tickets Recently Assigned to You</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => navigate(`/ticket/${ticket._id}`)}>Show Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Moderator;
