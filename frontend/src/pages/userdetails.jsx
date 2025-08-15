import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Userdetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [ticketLength, setTicketLength] = useState(0);
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setUserDetails(data.data);
        setTicketLength(data.ticketLength);
        toast.success(data.message ?? "User details fetched successfully");
      } else {
        toast.error(e.message ?? "Failed to fetch user details");
      }
    } catch (e) {
      toast.error(
        e.message ?? "An error occurred while fetching user details: "
      );
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
        {userDetails && (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-pink-500 text-center">
              Details of {userDetails.name}
            </h1>

            <p className="text-gray-700 mb-2">
              <strong>Email: </strong>
              {userDetails.email}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Role: </strong>
              {userDetails.role}
            </p>
            {userDetails.role === "user" ? (
              <p className="text-gray-700 mb-2">
                <strong>Number of tickets raised: </strong>
                {ticketLength}
              </p>
            ) : (
              <p className="text-gray-700 mb-2">
                <strong>Number of Tickets assigned: </strong>
                {ticketLength}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Userdetails;
