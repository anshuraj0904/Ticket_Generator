import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { handleLogout } from '../utils/handleLogout.js'
function Admin() {
  
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  
  const fetchTickets = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(response.status === 200){
        const allTickets = await response.json();
        setTickets(allTickets.data);
      } else {
        toast.error("Failed to fetch tickets");
      }

    } catch (error) {
      toast.error("An error occurred while fetching tickets" + error.message);
    }
  }
  useEffect(()=>{
    fetchTickets();
  },[])
 

  if(!tickets || tickets.length === 0) {
    return (
      <div className='min-h-screen bg-base-200 flex flex-col'>
       <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Welcome Admin</div>

        <div className="flex space-x-4">
          <button className="btn btn-outline btn-sm">Show All Users</button>
          {/* <button className="btn btn-outline btn-sm">Show All Tickets</button> */}
        </div>

        <button className="btn btn-error btn-sm"  onClick={() => handleLogout(navigate)}>Logout</button>
      </header>
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Tickets Available</h1>
          <p className="text-gray-600">There are currently no tickets to display.</p>
        </div>
      </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Welcome Admin</div>

        <div className="flex space-x-4">
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/show-users")}>Show All Users</button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/tickets")}>Show All Tickets</button>
        </div>

        <button className="btn btn-error btn-sm" onClick={()=>handleLogout(navigate)}>Logout</button>
      </header>

      {/* Body */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Tickets</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


export default Admin