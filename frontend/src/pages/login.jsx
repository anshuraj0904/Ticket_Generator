import React,{ useState} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Login() {

  const [form, setForm] = useState({email: "", password: ""})

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json();

      if(response.status === 200){        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.userDetails));
        toast.success(`${data.userDetails.role} Logged in successfully!`)
        if(data.userDetails.role === "admin"){
          navigate("/admin");
        } else if(data.userDetails.role === "moderator"){
          navigate("/moderator");
        } else {
          navigate("/user");
        }
      }
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
    finally {
      setLoading(false);
      form.email = "";
      form.password = "";
    }
  }


  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
  <div className="min-h-screen bg-base-200 flex items-center align-center p-4">
    <div className="card w-full max-w-md shadow-xl bg-base-100">
      <div className="card-body">
        <h1 className="card-title text-2xl">Log in to your account!</h1>
        <p className="text-sm opacity-70">
          Sign in with your basic details below.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          {/* Email */}
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="input input-bordered"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
              <span className="label-text-alt">min 6 chars</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full pr-16"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="form-control mt-6 flex items-center justify-between">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</div>


  );
}

export default Login;
