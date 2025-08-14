import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Note:- This is like a wrapper component that checks if the user is authenticated. So, it'll take children and protectedRoute as props.
function CheckAuth({ children, protectedRoute }) {
  // If protectedRoute is true, it means we want to protect the route and check if the user is authenticated.
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(protectedRoute)
    {
        if(!token)
        {
            navigate('/login')
        }
        else{
            setLoading(false)
        }
    }
    else{
        if(token)
        {
            navigate('/') 
            //  Here, we'll be getting to see all the tickets if the user is already logged in(this will depend on if the user is admin, moderator or a user.)
        }
        else{
            setLoading(false)
        }
    }
  },[navigate, protectedRoute])

  if(loading){
    return <div>Loading...</div>
  }

  return children
}

export default CheckAuth;
