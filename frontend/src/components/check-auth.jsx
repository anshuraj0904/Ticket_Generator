import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      // Protected route — must have token
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      // Public route — always accessible
      setLoading(false);
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default CheckAuth;
