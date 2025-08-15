import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
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
        setTicket(data.data);
        setSkills(data.data.relatedSkills || []);
      } else {
        toast.error("Failed to fetch ticket details:", data.message);
      }
    } catch (e) {
      toast.error("Error fetching ticket details:", e);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
        <p className="text-gray-600 mb-4">
          The requested ticket does not exist.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
      <h1 className="text-3xl font-bold mb-4 text-pink-500 text-center">
        {ticket.title}
      </h1>
      <p className="text-gray-700 mb-2">
        <strong>Description:</strong> {ticket.description}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Status:</strong> {ticket.status}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Priority:</strong> {ticket.priority}
      </p>
      {/* <p className="text-gray-700 mb-2">
        <strong>Assigned To:</strong>
        {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
      </p> */}
      <p className="text-gray-700 mb-2">
        <strong>Helpful Notes:</strong> {ticket.helpfulNotes || "N/A"}
      </p>
      <h1 className="text-gray-700 mb-4">
        <strong>Related Skills:</strong>
        {skills.length > 0 ? (
          <ul className="list-disc pl-5">
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-600">
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          "N/A"
        )}
      </h1>

      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default TicketDetailPage;
