import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

function Showusers() {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.message ?? "Users fetched successfully");
                setUsers(data.data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            toast.error("An error occurred while fetching users: " + error.message);
        }
    }
   
    useEffect(()=>{
        fetchUsers();
    },[])

    return <div className="w-full flex flex-col items-center">
            <button
        className="btn btn-secondary mb-4 self-start"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
      { !users || users.length === 0 ?(
          <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-2xl font-bold mb-4">No Registered Users</h1>
          <p className="text-gray-600">
            There are currently no users registered!
          </p>
        </div>
      ):
      (
            <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">All Users and Moderators</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/userdetails/${user._id}`)}
                      >
                        Show Details
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
}

export default Showusers