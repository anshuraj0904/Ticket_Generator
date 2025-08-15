import toast from "react-hot-toast";


export const handleLogout = async(navigate)=> {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`,{
      method: "POST",
      headers: { "Content-Type": "application/json" ,
      "Authorization": `Bearer ${localStorage.getItem("token")}`
      }

    })
    if(response.status === 200){
      navigate("/login");
      toast.success("User logged out successfully!")
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
}

