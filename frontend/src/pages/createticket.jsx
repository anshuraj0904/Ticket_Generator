import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Createticket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      console.log(form);
      
      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        navigate("/user");
      } else {
        toast.error(data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("An error occurred while creating the ticket");
    }
    finally{
        form.title = "";
        form.description = "";
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center p-4">
      <div className="bg-base-100 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Write your issue here
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <textarea
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter ticket title"
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue"
              className="textarea textarea-bordered w-full h-32"
              required
            ></textarea>
          </div>

          <button className="btn btn-primary w-full">Create Ticket</button>
        </form>
      </div>
    </div>
  );
}

export default Createticket;
